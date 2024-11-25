import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserFormService } from '../../services/user/user-form.service';
import { Router } from '@angular/router';
import { IUser } from '../../models/user.interface';
import { UserAuthService } from '../../services/auth/auth.service';
import { CurriculumService } from '../../services/curriculum/curriculum.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent implements OnInit {
  alertMessage: string = '';
  alertTitle: string = '';
  alertClass: string = '';
  alertIconClass: string = '';
  showAlert: boolean = false;
  user!: IUser;
  userForm!: FormGroup;
  userData = this.authService.getUserData();
  confirmedPassword!: string;
  isModalPasswordOpen!: boolean;
  actionToPerform!: () => void;
  attemptCount: number = 0;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userFormService: UserFormService,
    private curriculumService: CurriculumService,
    private authService: UserAuthService
  ) {}

  getUserData() {
    const id = this.userData?.id;
    this.userFormService.getUserData(id).subscribe(
      (response: IUser) => {
        this.user = response;
        this.createUserForm(this.user);
      },
      (error) => {
        console.log(`Erro ao buscar o usuário com ID ${id}: ${error}`);
      }
    );
  }

  createUserForm(user: IUser) {
    this.userForm = this.fb.group({
      name: [this.user?.name || '', [Validators.required]],
      phoneNumber: [
        this.user?.phoneNumber || '',
        [Validators.required, Validators.minLength(9)],
      ],
      cpf: [this.user?.cpf || '', [Validators.required]],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      password: [
        this.user?.password || '',
        [Validators.required, Validators.minLength(6)],
      ],
      confirmPassword: [
        this.user?.password || '',
        [Validators.required, Validators.minLength(6)],
      ],
    });
  }

  openModalPassword(action: () => void) {
    this.actionToPerform = action;
    this.isModalPasswordOpen = true;
  }
  closeModalPassword() {
    this.isModalPasswordOpen = false;
    this.confirmedPassword = '';
  }
  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.getUserData();
    } else {
      this.createUserForm(this.user);
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  async onSubmit() {
    if (this.userForm.valid) {
      const apiUrl = 'https://backend-production-ff1f.up.railway.app/users';

      const formData = this.userForm.value;

      if (formData.password === formData.confirmPassword) {
        const exists = await this.verifyEmail(formData.email);
        if (exists) {
          this.alertMessage = 'Email já vinculado a uma conta existente!';
          this.alertClass = 'alert alert-warning';
          this.alertTitle = 'Ops!';
          this.alertIconClass = 'bi bi-exclamation-circle';
          this.showAlert = true;
          this.resetAlertAfterDelay();
        } else {
          const body = {
            name: formData.name,
            cpf: formData.cpf,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            password: formData.password,
          };
          this.http.post<IUser>(apiUrl, body).subscribe(
            (response) => {
              this.userFormService.setFormData(this.userForm.value);
              this.alertMessage = 'Usuário cadastrado com sucesso!';
              this.alertClass = 'alert alert-success';
              this.alertTitle = 'Sucesso';
              this.alertIconClass = 'bi bi-check-circle';
              this.showAlert = true;
              this.resetAlertAfterDelay();

              setTimeout(() => {
                this.router.navigate(['/login/candidato']);
              }, 2000);
            },
            (error) => {
              window.alert(`Erro ao cadastrar usuário ${error}`);
            }
          );
        }
      } else if (formData.password !== formData.confirmPassword) {
        this.alertMessage = 'As senhas devem ser correspondentes!';
        this.alertClass = 'alert alert-danger';
        this.alertTitle = 'Erro';
        this.alertIconClass = 'bi bi-x-circle';
        this.showAlert = true;
        this.resetAlertAfterDelay();
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

  async onUpdate() {
    if (this.userForm.valid) {
      const id = this.userData?.id;
      const formData = this.userForm.value;
      const apiUrl = `https://backend-production-ff1f.up.railway.app/users/${id}`;
      const hasCurriculum = await this.authService.hasCurriculum(id);

      if (hasCurriculum) {
        const body = {
          name: formData.name,
          cpf: formData.cpf,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          curriculumId: this.userData?.id,
        };

        this.http.put<IUser>(apiUrl, body).subscribe(
          (response) => {
            this.userFormService.setFormData(this.userForm.value);
            this.alertMessage = 'Usuário atualizado com sucesso!';
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
            console.log(`erro ao atualizar usuário ${error}`);
          }
        );
      } else {
        const body = {
          name: formData.name,
          cpf: formData.cpf,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        };

        this.http.put<IUser>(apiUrl, body).subscribe(
          (response) => {
            this.userFormService.setFormData(this.userForm.value);
            this.alertMessage = 'Usuário atualizado com sucesso!';
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
            console.log(`erro ao atualizar usuário ${error}`);
          }
        );
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
  async verifyEmail(email: string): Promise<boolean> {
    try {
      const response = await this.http
        .get<IUser[]>('https://backend-production-ff1f.up.railway.app/users')
        .toPromise();

      if (response && Array.isArray(response)) {
        const emailExists = response.some((user) => user.email === email);
        return emailExists;
      } else {
        return false;
      }
    } catch (error) {
      console.log(`Erro ao buscar por emails cadastrados: ${error}`);
      return false;
    }
  }
   // Adicione esta propriedade na classe do componente.

confirmPassword() {
  if (this.user.password === this.confirmedPassword) {
    this.attemptCount = 0; // Redefine o contador em caso de sucesso.
    this.actionToPerform();
    this.closeModalPassword();
  } else {
    this.attemptCount++; // Incrementa o contador de tentativas.
    this.alertMessage = 'Cuidado, errar a senha mais de 3 vezes irá bloquear a tela!';
    this.alertClass = 'alert alert-danger';
    this.alertTitle = 'Senha incorreta!';
    this.alertIconClass = 'bi bi-x-circle';
    this.showAlert = true;
    this.resetAlertAfterDelay();

    if (this.attemptCount >= 3) {
      // Fecha o modal e executa o logout após 3 tentativas falhas.
      this.router.navigate(["/realize-login"])
      this.closeModalPassword();
      this.authService.logout(); // Supondo que `logout` está no `authService`.
    }
  }
}


  deleteUser() {
    const id = this.user.id;

    const deleteUserCallback = () => {
      this.userFormService.deleteUserData(id).subscribe(
        () => {
          this.showSuccessAlert('Dados excluídos com sucesso!');
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/']);
          }, 2000);
        },
        (error) => {
          this.showErrorAlert(`Erro ao deletar usuário: ${error.message}`);
        }
      );
    };

    if (this.user.curriculumId !== null) {
      this.curriculumService.deleteCurriculum(id).subscribe(
        () => deleteUserCallback(),
        (error) => {
          this.showErrorAlert(`Erro ao excluir currículo: ${error.message}`);
        }
      );
    } else {
      deleteUserCallback();
    }
  }

  showSuccessAlert(message: string) {
    this.alertMessage = message;
    this.alertClass = 'alert alert-success';
    this.alertTitle = 'Concluído';
    this.alertIconClass = 'bi bi-check-circle';
    this.showAlert = true;
    this.resetAlertAfterDelay();
  }

  showErrorAlert(message: string) {
    this.alertMessage = message;
    this.alertClass = 'alert alert-danger';
    this.alertTitle = 'Erro';
    this.alertIconClass = 'bi bi-x-circle';
    this.showAlert = true;
    this.resetAlertAfterDelay();
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
