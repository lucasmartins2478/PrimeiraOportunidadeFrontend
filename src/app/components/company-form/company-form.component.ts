import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { companyFormService } from '../../services/company/company-form.service';
import { Router } from '@angular/router';
import { ICompany } from '../../models/company.interface';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrl: './company-form.component.css',
})
export class CompanyFormComponent implements OnInit {
  alertMessage: string = '';
  alertType: 'success' | 'danger' = 'success';
  showAlert: boolean = false;

  companyForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private companyFormService: companyFormService
  ) {}

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required]],
      cnpj: ['', [Validators.required]],
      segment: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required]],
      responsible: ['', [Validators.required]],
      url: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      city: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      address: ['', [Validators.required]],
      addressNumber: ['', [Validators.required]],
      uf: ['', [Validators.required]],
    });
  }
  async onSubmit() {
    if (this.companyForm.valid) {
      const apiUrl = 'http://localhost:3333/companies';

      const formData = this.companyForm.value;

      if (formData.password === formData.confirmPassword) {
        const exists = await this.verifyCnpj(formData.cpnj);
        if (exists) {
          this.alertMessage = 'CNPJ já cadastrado';
          this.alertType = 'danger';
          this.showAlert = true;
          this.resetAlertAfterDelay();
        } else {
          const body = {
            name: formData.name,
            responsible: formData.responsible,
            cnpj: formData.cnpj,
            segment: formData.segment,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            password: formData.password,
            url: formData.url,
            address: formData.address,
            city: formData.city,
            cep: formData.cep,
            addressNumber: formData.addressNumber,
            uf: formData.uf,
          };
          this.http.post<ICompany[]>(apiUrl, body).subscribe(
            (response) => {
              this.companyFormService.setFormData(this.companyForm.value)
              this.alertMessage = 'Usuário cadastrado com sucesso!';
              this.alertType = 'success';
              this.showAlert = true;
              this.resetAlertAfterDelay();
              // this.router.navigate(['/login']);
            },
            (error) => {
              window.alert(`Erro ao cadastrar usuário ${error}`);
            }
          );
        }
      } else if (formData.password !== formData.confirmPassword) {
        this.alertMessage = 'As senhas devem ser correspondentes!';
        this.alertType = 'danger';
        this.showAlert = true;
        this.resetAlertAfterDelay();
      }

      // this.alertMessage = 'Usuário cadastrado com sucesso!';
      // this.alertType = 'success';
      // this.showAlert = true;
      // this.resetAlertAfterDelay();
    } else {
      this.alertMessage = 'Preencha os campos corretamente!';
      this.alertType = 'danger';
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
        const cnpjExists = response.some((company) => company.cnpj == cnpj);
        return cnpjExists;
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
