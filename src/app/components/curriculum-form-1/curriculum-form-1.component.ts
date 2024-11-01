import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/auth/auth.service';
import { ICurriculum } from '../../models/curriculum.interface';
import { IUser } from '../../models/user.interface';

@Component({
  selector: 'app-curriculum-form-1',
  templateUrl: './curriculum-form-1.component.html',
  styleUrls: ['./curriculum-form-1.component.css'], // Corrigido de styleUrl para styleUrls
})
export class CurriculumForm1Component implements OnInit {
  alertMessage: string = '';
  alertTitle: string = '';
  alertClass: string = '';
  alertIconClass: string = '';
  showAlert: boolean = false;
  userData = this.authService.getUserData();

  curriculumForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: UserAuthService // Adicionado AuthService
  ) {}

  ngOnInit(): void {
    // Recuperar os dados do usuário do AuthService

    // Inicializando o formulário com os valores recuperados do localStorage
    this.curriculumForm = this.fb.group({
      name: [this.userData?.name || '', [Validators.required]],
      dateOfBirth: ['', [Validators.required]], // Ajustar com os dados reais
      age: ['', [Validators.required]], // Ajustar com os dados reais
      phoneNumber: [this.userData?.phoneNumber || '', [Validators.required]],
      gender: ['', [Validators.required]],
      race: ['', [Validators.required]],
      email: [
        this.userData?.email || '',
        [Validators.required, Validators.email],
      ],
      city: ['', [Validators.required]],
      uf: ['', [Validators.required]],
      address: ['', [Validators.required]],
      addressNumber: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      currentlyStudying: [false],
    });
  }

  onSubmit() {
    if (this.curriculumForm.valid) {
      const formData = this.curriculumForm.value;

      const apiUrl = 'http://localhost:3333/curriculum';

      const body = {
        id: this.userData?.id,
        dateOfBirth: formData.dateOfBirth,
        age: formData.age,
        gender: formData.gender,
        race: formData.race,
        city: formData.city,
        address: formData.address,
        addressNumber: formData.addressNumber,
        cep: formData.cep,
        uf: formData.uf,
        userId: this.userData?.id,
      };

      console.log(this.userData);
      console.log(body);

      this.http.post<ICurriculum>(apiUrl, body).subscribe(
        (response) => {
          this.addCurriculum(this.userData?.id);
          this.alertMessage = 'Formulário válido!';
          this.alertClass = 'alert alert-success';
          this.alertTitle = 'Sucesso';
          this.alertIconClass = 'bi bi-check-circle';
          this.showAlert = true;
          this.resetAlertAfterDelay();
          setTimeout(() => {
            this.router.navigate(['/criar-curriculo/etapa2']);
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

  async addCurriculum(id: number | undefined) {
    const apiUrl = `http://localhost:3333/users/${id}/curriculum`;

    const body = {
      curriculumId: this.userData?.id,
    };

    try {
      const response = await this.http.put<IUser>(apiUrl, body).toPromise();
      console.log(response);
    } catch (error) {
      window.alert(`Erro ao fazer busca do currículo: ${error}`);
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
