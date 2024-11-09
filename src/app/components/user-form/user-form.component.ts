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
      name: [
        this.user?.name || '',
        [Validators.required, Validators.minLength(4)],
      ],
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
      const apiUrl = 'http://localhost:3333/users';

      const formData = this.userForm.value;

      if (formData.password === formData.confirmPassword) {
        const exists = await this.verifyEmail(formData.email);
        if (exists) {
          this.alertMessage = 'Email já vinculado a uma conta existente!';
          this.alertClass = 'alert alert-danger';
          this.alertTitle = 'Erro';
          this.alertIconClass = 'bi bi-x-circle';
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
      const apiUrl = `http://localhost:3333/users/${id}`;
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
            this.alertMessage = 'Usuário cadastrado com sucesso!';
            this.alertClass = 'success';
            this.showAlert = true;
            this.resetAlertAfterDelay();
            this.router.navigate(['/vagas']);
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
            this.alertMessage = 'Usuário cadastrado com sucesso!';
            this.alertClass = 'alert alert-success';
            this.showAlert = true;
            this.resetAlertAfterDelay();
            this.router.navigate(['/vagas']);
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
        .get<IUser[]>('http://localhost:3333/users')
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
  deleteUser() {
    const id = this.userData?.id;

    if (this.user.curriculumId != null) {
      this.curriculumService.deleteCurriculum(id).subscribe(
        (response) => {
          // Somente após a exclusão bem-sucedida do currículo, exclua o usuário
          this.userFormService.deleteUserData(id).subscribe(
            (response) => {
              this.alertMessage = 'Dados excluídos!';
              this.alertClass = 'alert alert-danger';
              this.alertTitle = 'Erro';
              this.alertIconClass = 'bi bi-x-circle';
              this.showAlert = true;
              this.resetAlertAfterDelay();

              setTimeout(() => {
                this.authService.logout();
                this.router.navigate(['/']);
              }, 2000);
            },
            (error) => {
              console.error(`Erro ao deletar usuário: ${error}`);
            }
          );
        },
        (error) => {
          console.error(`Erro ao excluir currículo: ${error}`);
        }
      );
    } else {
      // Se não houver currículo para excluir, apenas exclua o usuário
      this.userFormService.deleteUserData(id).subscribe(
        (response) => {
          this.alertMessage = 'Dados excluídos!';
          this.alertClass = 'alert alert-danger';
          this.alertTitle = 'Erro';
          this.alertIconClass = 'bi bi-x-circle';
          this.showAlert = true;
          this.resetAlertAfterDelay();

          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/']);
          }, 2000);
        },
        (error) => {
          console.error(`Erro ao deletar usuário: ${error}`);
        }
      );
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
