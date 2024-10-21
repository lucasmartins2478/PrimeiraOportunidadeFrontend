import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IAcademicData, ICurriculum } from '../../models/curriculum.interface';
import { UserAuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-curriculum-form-2',
  templateUrl: './curriculum-form-2.component.html',
  styleUrl: './curriculum-form-2.component.css',
})
export class CurriculumForm2Component {
  alertMessage: string = '';
  alertTitle: string = '';
  alertClass: string = '';
  alertIconClass: string = '';
  showAlert: boolean = false;

  academicForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserAuthService,
    private router: Router
  ) {
    this.academicForm = this.fb.group({
      institutions: this.fb.array([]),
    });

    this.addInstitution();
  }

  get institutions(): FormArray {
    return this.academicForm.get('institutions') as FormArray;
  }

  addInstitution() {
    const institutionForm = this.fb.group({
      institutionName: ['', Validators.required],
      semester: ['', Validators.required],
      startDate: ['', [Validators.required]],
      endDate: [''],
      isCurrentlyStudying: [false],
      name: ['', Validators.required],
      degree: ['', Validators.required],
      city: ['', Validators.required],
    });
    this.institutions.push(institutionForm);
  }

  removeInstitution(index: number) {
    this.institutions.removeAt(index);
  }

  onSubmit() {
    if (this.academicForm.valid) {
      // Process the form data
      const formData = this.academicForm.value;

      const institutionsData = this.institutions.value;

      const apiUrl = 'http://localhost:3333/academicData';

      if (institutionsData && institutionsData.length > 0) {
        institutionsData.forEach((institution: IAcademicData) => {
          const body = {
            name: institution.name,
            semester: institution.semester,
            startDate: institution.startDate,
            endDate: institution.endDate,
            isCurrentlyStudying: institution.isCurrentlyStudying,
            institutionName: institution.institutionName,
            degree: institution.degree,
            city: institution.city,
            curriculumId: this.userService.getUserData()?.id,
          };

          console.log(body);

          this.http.post<IAcademicData[]>(apiUrl, body).subscribe(
            (response) => {
              this.alertMessage = 'Formulário válido!';
              this.alertClass = 'alert alert-success';
              this.alertTitle = 'Sucesso';
              this.alertIconClass = 'bi bi-check-circle';
              this.showAlert = true;
              this.resetAlertAfterDelay();
            },
            (error) => {
              window.alert(`Erro ao cadastrar curriculo: ${error}`);
            }
          );
        });
        setTimeout(() => {
          this.router.navigate(['/criar-curriculo/etapa3']);
        }, 2000);
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
