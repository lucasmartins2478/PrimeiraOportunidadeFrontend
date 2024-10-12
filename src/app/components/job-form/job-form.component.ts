import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/auth/auth.service';
import { IJob } from '../../models/job.interface';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrl: './job-form.component.css',
})
export class JobFormComponent {
  alertMessage: string = '';
  alertType: 'success' | 'danger' = 'success';
  showAlert: boolean = false;
  companyData = this.authService.getCompanyData();

  jobForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: UserAuthService // Adicionado AuthService
  ) {}

  ngOnInit(): void {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required]],
      modality: ['', [Validators.required]],
      locality: ['', [Validators.required]],
      uf: ['', [Validators.required]],
      contact: [this.companyData?.email, [Validators.required]],
      salary: ['', [Validators.required, Validators.maxLength(11)]],
      toAgree:[false],
      level: ['', [Validators.required]],
      description: [''],
      requirements: ['', [Validators.required]],
      aboutCompany: ['', [Validators.required]],
      benefits: ['', [Validators.required]],
    });

    // Preencher os dados do usuário no formulário
    // const savedData = this.authService.getUserData(); // Recupera os dados do usuário do AuthService
    // if (savedData) {
    //   this.curriculumForm.patchValue({
    //     name: savedData.name,
    //     email: savedData.email,
    //     celPhoneNumber: savedData.phoneNumber, // Use a chave correta para o telefone
    //   });
    // }
  }

  onSubmit() {
    if (true) {
      const apiUrl = 'http://localhost:3333/vacancy';
      const formData = this.jobForm.value;

      const body = {
        title: formData.title,
        modality: formData.modality,
        locality: formData.locality,
        uf: formData.uf,
        contact: formData.contact,
        salary: formData.salary,
        level: formData.level,
        description: formData.description,
        requirements: formData.requirements,
        aboutCompany: formData.aboutCompany,
        benefits: formData.benefits,
        companyId: this.companyData?.id,
      };

      this.http.post<IJob[]>(apiUrl, body).subscribe(
        (response) => {
          this.alertMessage = 'Vaga criada com sucesso!';
          this.alertType = 'success';
          this.showAlert = true;
          this.resetAlertAfterDelay();
        },
        (error) => {
          window.alert(`Erro ao cadastrar usuário ${error}`);
        }
      );
    } else {
      this.alertMessage = 'Formulário inválido';
      this.alertType = 'danger';
      this.showAlert = true;
      this.resetAlertAfterDelay();
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
