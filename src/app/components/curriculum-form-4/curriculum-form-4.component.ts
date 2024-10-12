import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/auth/auth.service';
import { ICurriculum } from '../../models/curriculum.interface';

@Component({
  selector: 'app-curriculum-form-4',
  templateUrl: './curriculum-form-4.component.html',
  styleUrl: './curriculum-form-4.component.css'
})
export class CurriculumForm4Component implements OnInit {
  alertMessage: string = '';
  alertType: 'success' | 'danger' = 'success';
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
      attached:[''],
      description:['', [Validators.required]]
    });
  }
  onSubmit() {
    if (this.adictionalDataForm.valid) {

      const id = this.userService.getUserData()?.id
      const formData = this.adictionalDataForm.value

      const apiUrl = `http://localhost:3333/curriculum/${id}/addData`

      const body = {
        description: formData.description,
        attached: formData.attached
      }

      console.log(apiUrl)
      console.log(body)

      this.http.put<ICurriculum[]>(apiUrl, body).subscribe(
        (response) => {
          this.alertMessage = 'Formulário válido!';
          this.alertType = 'success';
          this.showAlert = true;
          this.resetAlertAfterDelay();
          this.router.navigate(['/vagas']); // Após a confirmação
        },
        (error) => {
          window.alert(`Erro ao cadastrar currículo: ${error}`);
        }
      );


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
