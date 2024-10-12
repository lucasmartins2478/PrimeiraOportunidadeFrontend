import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ICompetences, ICoursesData } from '../../models/curriculum.interface';
import { UserAuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserAuthService,
    private http: HttpClient
  ) {
    // Cria o FormGroup para o formulário
    this.courseForm = this.fb.group({
      courses: this.fb.array([]),
      competenceInput: ['', [Validators.required]],// FormArray para cursos
      competencies: this.fb.array([]), // FormArray para competências
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
    } else {
      this.addCourse();
    }
  }

  // Getter para o FormArray de competencies
get competencies(): FormArray {
  return this.courseForm.get('competencies') as FormArray;
}

// Adicionar uma competência ao FormArray
addCompetence(): void {
  const competenceValue = this.courseForm.get('competenceInput')?.value;

  if (competenceValue) {
    this.competencies.push(this.fb.control(competenceValue));
    this.courseForm.get('competenceInput')?.reset(); // Limpa o campo após adicionar
  }
}

// Remover uma competência do FormArray
removeCompetence(index: number): void {
  this.competencies.removeAt(index);
}


  // Método de submissão do formulário
  onSubmit(): void {
    if (this.courseForm.valid) {
      const formData = this.courseForm.value;
      const coursesData = this.courses.value;
      const competenciesData = this.competencies.value;

      console.log(formData);

      // Enviar dados dos cursos
      if (coursesData && coursesData.length > 0) {
        coursesData.forEach((course: ICoursesData) => {
          const apiUrl = 'http://localhost:3333/courseData';

          const body = {
            name: course.name,
            modality: course.modality,
            duration: course.duration,
            endDate: course.endDate,
            isCurrentlyStudying: course.isCurrentlyStudying,
            institutionName: course.institutionName,
            curriculumId: this.userService.getUserData()?.id,
          };

          this.http.post<ICoursesData[]>(apiUrl, body).subscribe(
            (response) => {
              this.alertMessage = 'Curso cadastrado com sucesso!';
              this.alertType = 'success';
              this.showAlert = true;
              this.resetAlertAfterDelay();
            },
            (error) => {
              window.alert(`Erro ao cadastrar curso: ${error}`);
            }
          );
        });
      }

      // Enviar dados das competências
      if (competenciesData && competenciesData.length > 0) {
        competenciesData.forEach((competence: string) => {
          const apiUrl = 'http://localhost:3333/competences';

          const body = {
            name: competence,
            curriculumId: this.userService.getUserData()?.id,
          };

          this.http.post<ICompetences[]>(apiUrl, body).subscribe(
            (response) => {
              this.alertMessage = 'Competência cadastrada com sucesso!';
              this.alertType = 'success';
              this.showAlert = true;
              this.resetAlertAfterDelay();
            },
            (error) => {
              window.alert(`Erro ao cadastrar competência: ${error}`);
            }
          );
        });
      }

      this.router.navigate(['/criar-curriculo/etapa4']);
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
