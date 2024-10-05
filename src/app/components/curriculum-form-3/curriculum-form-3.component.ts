import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-curriculum-form-3',
  templateUrl: './curriculum-form-3.component.html',
  styleUrls: ['./curriculum-form-3.component.css'],
})
export class CurriculumForm3Component implements OnInit {
  alertMessage: string = '';
  alertType: 'success' | 'danger' = 'success';
  showAlert: boolean = false;
  isChecked: boolean = false;

  courseForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    // Cria o FormGroup para o formulário
    this.courseForm = this.fb.group({
      courses: this.fb.array([]), // FormArray para cursos
      competence: ['', Validators.required], // Campo para competências gerais
    });
  }

  ngOnInit(): void {
    // Adiciona um curso ao iniciar
    this.addCourse();
  }

  // Getter para o FormArray de courses
  get courses(): FormArray {
    return this.courseForm.get('courses') as FormArray;
  }

  // Método para adicionar um novo curso ao FormArray
  addCourse(): void {
    const courseGroup = this.fb.group({
      name: ['', Validators.required],
      modality: ['', Validators.required],
      duration: ['', Validators.required],
      dateOfEnd: [''],
      isCurrentlyStudying: [false],
      institutionName: ['', Validators.required],
    });

    this.courses.push(courseGroup);
  }

  // Método para remover um curso pelo índice
  removeCourse(index: number): void {
    this.courses.removeAt(index);
  }

  onCheckboxChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log('Checkbox mudou:', isChecked);

    // Disparar outra função ou lógica com base no valor
    if (isChecked) {
      this.removeCourse(0);
    }else{
      this.addCourse()
    }
  }

  // Método de submissão do formulário
  onSubmit(): void {
    if (this.courseForm.valid) {
      this.alertMessage = 'Formulário válido!';
      this.alertType = 'success';
      this.showAlert = true;
      this.resetAlertAfterDelay();
      console.log(this.courseForm.value);
      this.router.navigate(['/criar-curriculo/etapa4']); // Navega para a próxima etapa
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
