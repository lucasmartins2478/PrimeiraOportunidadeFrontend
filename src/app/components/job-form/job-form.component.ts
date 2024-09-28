import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrl: './job-form.component.css'
})
export class JobFormComponent {

  alertMessage: string = '';
  alertType: 'success' | 'danger' = 'success';
  showAlert: boolean = false;

  jobForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: UserAuthService // Adicionado AuthService
  ) {}

  ngOnInit(): void {
    this.jobForm = this.fb.group({
      name: ['', [Validators.required]],
      modality: ['', [Validators.required]],
      locality: ['', [Validators.required]],
      uf: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      salary: ['', [Validators.required]],
      level: ['', [Validators.required]],
      description: ['', [Validators.required]],
      requirements: ['', [Validators.required]],
      company: ['', [Validators.required]],
      benefits: ['', [Validators.required]]
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
    if (this.jobForm.valid) {
      this.alertMessage = 'Formulário válido!';
      this.alertType = 'success';
      this.showAlert = true;
      this.resetAlertAfterDelay();
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
