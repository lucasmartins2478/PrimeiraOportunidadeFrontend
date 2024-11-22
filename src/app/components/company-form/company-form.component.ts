import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { companyFormService } from '../../services/company/company-form.service';
import { Router } from '@angular/router';
import { ICompany } from '../../models/company.interface';
import { UserAuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css'], // Corrigi a propriedade 'styleUrl' para 'styleUrls'
})
export class CompanyFormComponent implements OnInit {
  alertMessage: string = '';
  alertTitle: string = '';
  alertClass: string = '';
  alertIconClass: string = '';
  showAlert: boolean = false;
  company!: ICompany;
  companyForm!: FormGroup;
  companyData = this.authService.getCompanyData();
  confirmedPassword!: string;
  isModalPasswordOpen!: boolean;
  actionToPerform!: () => void;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private companyFormService: companyFormService,
    private authService: UserAuthService
  ) {}

  getCompanyData() {
    const id = this.companyData?.id;
    this.companyFormService.getUserData(id).subscribe(
      (response: ICompany) => {
        this.company = response;
        this.createCompanyForm(this.company);
      },
      (error) => {
        console.log(`Erro ao buscar a empresa com ID ${id}: ${error}`);
      }
    );
  }

  createCompanyForm(company: ICompany) {
    this.companyForm = this.fb.group({
      name: [this.company?.name || '', [Validators.required]],
      cnpj: [this.company?.cnpj || '', [Validators.required]],
      segment: [this.company?.segment || '', [Validators.required]],
      phoneNumber: [this.company?.phoneNumber || '', [Validators.required]],
      email: [this.company?.email || '', [Validators.required]],
      responsible: [this.company?.responsible || '', [Validators.required]],
      url: [this.company?.url || ''],
      password: [this.company?.password || '', [Validators.required]],
      confirmPassword: [this.company?.password || '', [Validators.required]],
      city: [this.company?.city || '', [Validators.required]],
      cep: [this.company?.cep || '', [Validators.required]],
      address: [this.company?.address || '', [Validators.required]],
      addressNumber: [this.company?.addressNumber || '', [Validators.required]],
      uf: [this.company?.uf || '', [Validators.required]],
      logo: [''],
    });
  }

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.getCompanyData();
    } else {
      this.createCompanyForm(this.company);
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
  openModalPassword(action: () => void) {
    this.actionToPerform = action;
    this.isModalPasswordOpen = true;
  }
  closeModalPassword() {
    this.isModalPasswordOpen = false;
    this.confirmedPassword = '';
  }
  confirmPassword() {
    if (this.company.password === this.confirmedPassword) {
      this.actionToPerform();
      this.closeModalPassword();
    } else {
      this.alertMessage = 'Senha incorreta!';
      this.alertClass = 'alert alert-danger';
      this.alertTitle = 'Erro';
      this.alertIconClass = 'bi bi-x-circle';
      this.showAlert = true;
      this.resetAlertAfterDelay();
    }
  }
  deleteCompany() {
    const id = this.company.id;
    this.companyFormService.deleteCompanyData(id).subscribe(
      (response) => {
        this.alertMessage = 'Dados excluídos com sucesso!';
        this.alertClass = 'alert alert-success';
        this.alertTitle = 'Concluído';
        this.alertIconClass = 'bi bi-check-circle';
        this.showAlert = true;
        this.resetAlertAfterDelay();
      },
      (error) => {
        console.error(`Erro ao deletar empresa ${error}`);
      }
    );
  }

  // Método chamado ao selecionar um arquivo de imagem

  async onSubmit() {
    if (this.companyForm.valid) {
      const apiUrl = 'https://backend-production-ff1f.up.railway.app/companies';

      const formData = this.companyForm.value;

      if (formData.password === formData.confirmPassword) {
        const exists = await this.verifyCnpj(formData.cnpj);
        if (exists) {
          this.alertMessage =
            'O CNPJ informado já está vinculado a uma conta existente!';
          this.alertClass = 'alert alert-danger';
          this.alertTitle = 'Erro';
          this.alertIconClass = 'bi bi-x-circle';
          this.showAlert = true;
          this.resetAlertAfterDelay();
        } else {
          this.http.post<ICompany>(apiUrl, formData).subscribe(
            (response) => {
              this.companyFormService.setFormData(this.companyForm.value);
              this.alertMessage = 'Empresa cadastrado com sucesso!';
              this.alertClass = 'alert alert-success';
              this.alertTitle = 'Sucesso';
              this.alertIconClass = 'bi bi-check-circle';
              this.showAlert = true;
              this.resetAlertAfterDelay();
              setTimeout(() => {
                this.router.navigate(['/login/empresa']);
              }, 2000);
            },
            (error) => {
              window.alert(`Erro ao cadastrar usuário ${error}`);
            }
          );
        }
      } else {
        this.alertMessage = 'As senhas devem ser correspondentes!';
        this.alertClass = 'alert alert-danger';
        this.alertTitle = 'Erro';
        this.alertIconClass = 'bi bi-x-circle';
        this.showAlert = true;
        this.resetAlertAfterDelay();
      }
    } else {
      this.alertMessage = 'Preencha os dados corretamente!';
      this.alertClass = 'alert alert-danger';
      this.alertTitle = 'Erro';
      this.alertIconClass = 'bi bi-x-circle';
      this.showAlert = true;
      this.resetAlertAfterDelay();
    }
  }

  async onUpdate() {
    if (this.companyForm.valid) {
      const id = this.companyData?.id;
      const apiUrl = `https://backend-production-ff1f.up.railway.app/companies/${id}`;
      const formData = this.companyForm.value;

      this.http.put<ICompany>(apiUrl, formData).subscribe(
        (response) => {
          this.companyFormService.setFormData(this.companyForm.value);
          this.alertMessage = 'Empresa atualizada com sucesso!';
          this.alertClass = 'alert alert-success';
          this.alertTitle = 'Sucesso';
          this.alertIconClass = 'bi bi-check-circle';
          this.showAlert = true;
          this.resetAlertAfterDelay();
          setTimeout(() => {
            this.router.navigate(['/minhas-vagas']);
          }, 2000);
        },
        (error) => {
          console.log(`Erro ao atualizar a empresa: ${error}`);
        }
      );
    } else {
      this.alertMessage = 'Preencha os dados corretamente!';
      this.alertClass = 'alert alert-danger';
      this.alertTitle = 'Erro';
      this.alertIconClass = 'bi bi-x-circle';
      this.showAlert = true;
      this.resetAlertAfterDelay();
    }
  }

  async verifyCnpj(cnpj: string): Promise<boolean> {
    try {
      const response = await this.http
        .get<ICompany[]>(
          'https://backend-production-ff1f.up.railway.app/companies'
        )
        .toPromise();

      if (response && Array.isArray(response)) {
        return response.some((company) => company.cnpj === cnpj);
      } else {
        return false;
      }
    } catch (error) {
      console.log(`Erro ao buscar por cnpj cadastrados: ${error}`);
      return false;
    }
  }

  resetAlertAfterDelay() {
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  clearAlert() {
    this.alertMessage = '';
    this.showAlert = false;
  }
}
