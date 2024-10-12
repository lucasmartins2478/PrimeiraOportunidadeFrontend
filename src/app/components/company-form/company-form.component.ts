import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { companyFormService } from '../../services/company/company-form.service';
import { Router } from '@angular/router';
import { ICompany } from '../../models/company.interface';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css'], // Corrigi a propriedade 'styleUrl' para 'styleUrls'
})
export class CompanyFormComponent implements OnInit {

  // ngOnInit(): void {

  // }

  // imageUrl: string | ArrayBuffer | null = null;

  // onFileChange(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length) {
  //     const file = input.files[0];
  //     this.imageUrl = URL.createObjectURL(file);
  //     console.log('Arquivo selecionado:', file);
  //   }
  // }

  // onSubmit(): void {
  //   if (this.imageUrl) {
  //     console.log('Imagem enviada:', this.imageUrl);
  //     // Aqui você pode enviar a imagem para o servidor, se necessário
  //   } else {
  //     console.log('Nenhuma imagem foi selecionada.');
  //   }
  // }

  alertMessage: string = '';
  alertType: 'success' | 'danger' = 'success';
  showAlert: boolean = false;

  companyForm!: FormGroup;
  logoUrl: any = ''; // URL da imagem

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
      logo: ['', [Validators.required]]
    });
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
          this.alertMessage = 'CNPJ já cadastrado';
          this.alertType = 'danger';
          this.showAlert = true;
          this.resetAlertAfterDelay();
        } else {
          // Adiciona os dados do formulário ao FormData
          for (const key in formValue) {
            formData.append(key, formValue[key]);
          }

          this.http.post<ICompany[]>(apiUrl, formValue).subscribe(
            (response) => {
              this.companyFormService.setFormData(this.companyForm.value);
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
      } else {
        this.alertMessage = 'As senhas devem ser correspondentes!';
        this.alertType = 'danger';
        this.showAlert = true;
        this.resetAlertAfterDelay();
      }
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
