import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-curriculum-form',
  templateUrl: './curriculum-form.component.html',
  styleUrl: './curriculum-form.component.css',
})
export class CurriculumFormComponent implements OnInit{
  alertMessage: string = '';
  alertType: 'success' | 'danger' = 'success';
  showAlert: boolean = false;

  curriculumForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.curriculumForm = this.fb.group({
      name:[],
      cpf:[]
    });
  }
  onSubmit() {
    if (this.curriculumForm.valid) {
      window.alert('Formulário válido');

      this.alertMessage = 'Formulário válido!';
      this.alertType = 'success';
      this.showAlert = true;
      this.resetAlertAfterDelay();
    } else {
      window.alert('Formulário inválido');

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
