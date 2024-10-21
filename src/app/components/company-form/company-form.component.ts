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
  logoUrl: any = ''; // URL da imagem
  companyData = this.authService.getCompanyData();

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
      url: [this.company?.url || '', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      city: [this.company?.city || '', [Validators.required]],
      cep: [this.company?.cep || '', [Validators.required]],
      address: [this.company?.address || '', [Validators.required]],
      addressNumber: [this.company?.addressNumber || '', [Validators.required]],
      uf: [this.company?.uf || '', [Validators.required]],
      logo: [this.company?.logo || ''],
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

  // Método chamado ao selecionar um arquivo de imagem
  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement; // Cast para HTMLInputElement
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.companyForm.patchValue({ logo: file }); // Armazena o arquivo no formulário

      const reader = new FileReader(); // Cria um novo FileReader
      reader.onload = (e) => {
        this.logoUrl = e.target?.result; // Define a URL da imagem
      };
      reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados
    }
  }

  async onSubmit() {
    if (this.companyForm.valid) {
      const apiUrl = 'http://localhost:3333/companies';

      const formData = new FormData();
      const formValue = this.companyForm.value;

      if (formValue.password === formValue.confirmPassword) {
        const exists = await this.verifyCnpj(formValue.cnpj);
        if (exists) {
          this.alertMessage =
            'O CNPJ informado já está vinculado a uma conta existente!';
          this.alertClass = 'alert alert-danger';
          this.alertTitle = 'Erro';
          this.alertIconClass = 'bi bi-x-circle';
          this.showAlert = true;
          this.resetAlertAfterDelay();
        } else {
          // Adiciona os dados do formulário ao FormData
          for (const key in formValue) {
            formData.append(key, formValue[key]);
          }

          this.http.post<ICompany>(apiUrl, formValue).subscribe(
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
      const apiUrl = `http://localhost:3333/companies/${id}`;

      // Criar um FormData para garantir que o arquivo (logo) seja enviado corretamente
      const formData = new FormData();
      const formValue = this.companyForm.value;

      // Adiciona os dados do formulário ao FormData
      for (const key in formValue) {
        formData.append(key, formValue[key]);
      }

      this.http.put<ICompany>(apiUrl, formData).subscribe(
        (response) => {
          this.companyFormService.setFormData(this.companyForm.value);
          this.alertMessage = 'Empresa atualizada com sucesso!';
          this.alertClass = 'alert alert-success';
          this.showAlert = true;
          this.resetAlertAfterDelay();
          this.router.navigate(['/minhas-vagas']);
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
        .get<ICompany[]>('http://localhost:3333/companies')
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
