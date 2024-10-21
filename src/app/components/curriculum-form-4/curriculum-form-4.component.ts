import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/auth/auth.service';
import { ICurriculum } from '../../models/curriculum.interface';

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

  adictionalDataForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userService: UserAuthService
  ) {}

  ngOnInit(): void {
    this.adictionalDataForm = this.fb.group({
      attached: [''],
      description: ['', [Validators.required]],
    });
  }
  onSubmit() {
    if (this.adictionalDataForm.valid) {
      const id = this.userService.getUserData()?.id;
      const formData = this.adictionalDataForm.value;

      const apiUrl = `http://localhost:3333/curriculum/${id}/addData`;

      const body = {
        description: formData.description,
        attached: formData.attached,
      };

      console.log(apiUrl);
      console.log(body);

      this.http.put<ICurriculum[]>(apiUrl, body).subscribe(
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
