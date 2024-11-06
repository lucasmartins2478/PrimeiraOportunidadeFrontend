import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/auth/auth.service';
import { ICurriculum } from '../../models/curriculum.interface';
import { IUser } from '../../models/user.interface';
import { CurriculumService } from '../../services/curriculum/curriculum.service';
import { UserFormService } from '../../services/user/user-form.service';

@Component({
  selector: 'app-curriculum-form-1',
  templateUrl: './curriculum-form-1.component.html',
  styleUrls: ['./curriculum-form-1.component.css'],
})
export class CurriculumForm1Component implements OnInit {
  alertMessage: string = '';
  alertTitle: string = '';
  alertClass: string = '';
  alertIconClass: string = '';
  showAlert: boolean = false;
  userData = this.authService.getUserData();
  user!: IUser;
  curriculumData!: ICurriculum;
  curriculumForm!: FormGroup;
  hasCurriculum!: boolean;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: UserAuthService,
    private userFormService: UserFormService,
    private curriculumService: CurriculumService
  ) {}

  ngOnInit(): void {
    this.checkCurriculum();
  }

  checkCurriculum() {
    const id = this.userData?.id;

    if (!id) {
      console.log('ID do usuário não encontrado.');
      return;
    }

    this.userFormService.getUserData(id).subscribe(
      (response) => {
        this.hasCurriculum = response.curriculumId != null;
        this.getUserData(); // Carrega os dados do usuário e chama createForm
      },
      (error) => {
        console.log('Erro ao fazer busca do usuário:', error);
      }
    );
  }

  getUserData() {
    const id = this.userData?.id;

    if (!id) {
      console.log('ID do usuário não encontrado.');
      return;
    }

    this.userFormService.getUserData(id).subscribe(
      (response: IUser) => {
        this.user = response;
        if (this.hasCurriculum) {
          this.getCurriculumData(); // Se o currículo existe, carrega os dados
        } else {
          this.createForm(); // Caso contrário, cria o formulário vazio
        }
      },
      (error) => {
        console.log(`Erro ao buscar o usuário com ID ${id}: ${error}`);
      }
    );
  }

  getCurriculumData() {
    const id = this.userData?.id;

    if (!id) {
      console.log('ID do usuário não encontrado.');
      return;
    }

    this.curriculumService.getCurriculumData(id).subscribe(
      (response: ICurriculum) => {
        this.curriculumData = response;
        this.createForm(); // Atualiza o formulário com os dados do currículo
      },
      (error) => {
        console.log(`Erro ao buscar currículo: ${error}`);
      }
    );
  }

  createForm() {
    this.curriculumForm = this.fb.group({
      name: [this.user?.name || '', [Validators.required]],
      dateOfBirth: [
        this.curriculumData?.dateOfBirth || '',
        [Validators.required],
      ],
      age: [this.curriculumData?.age || '', [Validators.required]],
      phoneNumber: [this.user?.phoneNumber || '', [Validators.required]],
      gender: [this.curriculumData?.gender || '', [Validators.required]],
      race: [this.curriculumData?.race || '', [Validators.required]],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      city: [this.curriculumData?.city || '', [Validators.required]],
      uf: [this.curriculumData?.uf || '', [Validators.required]],
      address: [this.curriculumData?.address || '', [Validators.required]],
      addressNumber: [
        this.curriculumData?.addressNumber || '',
        [Validators.required],
      ],
      cep: [this.curriculumData?.cep || '', [Validators.required]],
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

  onUpdate() {
    if (this.curriculumForm.valid) {
      const formData = this.curriculumForm.value;
      const id = this.userData?.id; // Aqui você deve garantir que o ID do currículo correto está sendo utilizado

      const apiUrl = `http://localhost:3333/curriculum/${id}`; // Verifique se este ID é realmente o ID do currículo

      const body = {
        dateOfBirth: formData.dateOfBirth,
        age: formData.age,
        gender: formData.gender,
        race: formData.race,
        city: formData.city,
        address: formData.address,
        addressNumber: formData.addressNumber,
        cep: formData.cep,
        uf: formData.uf,
      };

      this.http.put<ICurriculum>(apiUrl, body).subscribe(
        (response) => {
          this.alertMessage = 'Curriculo Atualizado com sucesso!';
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
          window.alert(`Erro ao atualizar currículo: ${error}`);
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
