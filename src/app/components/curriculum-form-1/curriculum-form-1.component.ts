import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-curriculum-form-1',
  templateUrl: './curriculum-form-1.component.html',
  styleUrls: ['./curriculum-form-1.component.css'], // Corrigido de styleUrl para styleUrls
})
export class CurriculumForm1Component implements OnInit {
  alertMessage: string = '';
  alertType: 'success' | 'danger' = 'success';
  showAlert: boolean = false;

  curriculumForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // Adicionado AuthService
  ) {}

  ngOnInit(): void {
    this.curriculumForm = this.fb.group({
      name: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      age: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      race: ['', [Validators.required]],
      email: ['', [Validators.required]],
      city: ['', [Validators.required]],
      uf: ['', [Validators.required]],
      address: ['', [Validators.required]],
      addressNumber: ['', [Validators.required]],
      cep: ['', [Validators.required]],
    });

    // Preencher os dados do usuário no formulário
    const savedData = this.authService.getUserData(); // Recupera os dados do usuário do AuthService
    if (savedData) {
      this.curriculumForm.patchValue({
        name: savedData.name,
        email: savedData.email,
        celPhoneNumber: savedData.phoneNumber, // Use a chave correta para o telefone
      });
    }
  }

  onSubmit() {
    if (this.curriculumForm.valid) {
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
