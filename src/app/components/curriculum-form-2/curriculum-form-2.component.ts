import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-curriculum-form-2',
  templateUrl: './curriculum-form-2.component.html',
  styleUrl: './curriculum-form-2.component.css'
})
export class CurriculumForm2Component{
  alertMessage: string = '';
  alertType: 'success' | 'danger' = 'success';
  showAlert: boolean = false;

  academicForm: FormGroup;

  constructor(private fb: FormBuilder, private router:Router) {
    this.academicForm = this.fb.group({
      institutions: this.fb.array([]) // Inicializando um FormArray
    });

    this.addInstitution()
  }

  // Método para obter o FormArray 
  get institutions(): FormArray {
    return this.academicForm.get('institutions') as FormArray;
  }

  // Método para adicionar uma nova instituição
  addInstitution() {
    const institutionGroup = this.fb.group({
      name: ['', Validators.required],
      semester: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      isCurrentlyStudying: [false],
      institutionName: ['', Validators.required],
      degree: ['', Validators.required],
      city: ['', Validators.required] // Checkbox para "Estudo aqui atualmente"
    });

    this.institutions.push(institutionGroup);
  }

  // Método para remover uma instituição
  removeInstitution(index: number) {
    this.institutions.removeAt(index);
  }

  // Método para enviar o formulário (caso você queira implementar)
  onSubmit() {
    if (this.academicForm.valid) {
      const formData = this.academicForm.value
      this.alertMessage = 'Formulário válido!';
      this.alertType = 'success';
      this.showAlert = true;
      this.resetAlertAfterDelay();
      console.log(formData)
      this.router.navigate(["/criar-curriculo/etapa3"])
    }else{
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
