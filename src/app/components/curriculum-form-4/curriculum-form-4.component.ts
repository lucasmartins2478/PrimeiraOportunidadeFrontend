import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/auth/auth.service';
import { ICurriculum } from '../../models/curriculum.interface';
import { CurriculumService } from '../../services/curriculum/curriculum.service';

@Component({
  selector: 'app-curriculum-form-4',
  templateUrl: './curriculum-form-4.component.html',
  styleUrl: './curriculum-form-4.component.css',
})
export class CurriculumForm4Component implements OnInit {
  alertMessage: string = '';
  alertTitle: string = '';
  alertClass: string = '';
  alertIconClass: string = '';
  showAlert: boolean = false;
  curriculumData!: ICurriculum;
  adictionalDataForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userService: UserAuthService,
    private curriculumService: CurriculumService
  ) {}

  ngOnInit(): void {
    this.getCurriculumData();
  }

  createForm() {
    this.adictionalDataForm = this.fb.group({
      attached: [''],
      description: [
        this.curriculumData.description || '',
        [Validators.required],
      ],
    });
  }

  getCurriculumData() {
    const id = this.userService.getUserData()?.id;
    this.curriculumService.getCurriculumData(id).subscribe(
      (response) => {
        this.curriculumData = response;
        this.createForm();
      },
      (error) => {
        console.error(`Erro ao buscar curriculo ${error}`);
      }
    );
  }
  onSubmit() {
    if (this.adictionalDataForm.valid) {
      const id = this.userService.getUserData()?.id;
      const formData = this.adictionalDataForm.value;

      const apiUrl = `https://backend-production-ff1f.up.railway.app/curriculum/${id}/addData`;

      const body = {
        description: formData.description,
        attached: formData.attached,
      };
      this.http.put<ICurriculum>(apiUrl, body).subscribe(
        (response) => {
          this.alertMessage = 'Formulário válido!';
          this.alertClass = 'alert alert-success';
          this.alertTitle = 'Sucesso';
          this.alertIconClass = 'bi bi-check-circle';
          this.showAlert = true;
          this.resetAlertAfterDelay();
          setTimeout(() => {
            this.router.navigate(['/vagas']);
          }, 2000);
        },
        (error) => {
          window.alert(`Erro ao cadastrar currículo: ${error}`);
        }
      );
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
