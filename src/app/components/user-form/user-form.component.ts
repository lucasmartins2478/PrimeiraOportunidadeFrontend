import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserFormService } from '../../services/user/user-form.service';
import { Router } from '@angular/router';
import { IUser } from '../../models/user.interface';
import { UserAuthService } from '../../services/auth/auth.service';
import { CurriculumService } from '../../services/curriculum/curriculum.service';
import { ModalService } from '../../services/modal/modal.service';

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
  isLoading: boolean = true;
  showPasswordGuidelines = false;
  passwordStrength = {
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userFormService: UserFormService,
    private curriculumService: CurriculumService,
    private authService: UserAuthService,
    private modalService: ModalService
  ) {}

  private async loadData(): Promise<void> {
    this.isLoading = true; // Define como true no início
    try {
      await this.getUserData();
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
      // Exiba uma mensagem de erro na UI se necessário
    } finally {
      this.isLoading = false; // Conclui o carregamento
    }
  }
  validatePasswordStrength(): void {
    const password = this.userForm.get('password')?.value || '';
    this.passwordStrength = {
      hasMinLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }
  private showError(message: string): void {
    // Adicione a lógica para exibir uma mensagem de erro, ex: alerta ou toast
    console.error(message);
  }

  async getUserData(): Promise<void> {
    const id = this.userData?.id;
    if (!id) {
      console.error('ID do usuário não encontrado.');
      return Promise.reject('ID do usuário não encontrado.');
    }

    return new Promise<void>((resolve, reject) => {
      this.userFormService.getUserData(id).subscribe(
        (response: IUser) => {
          if (!response) {
            console.error('Usuário não encontrado.');
            reject('Usuário não encontrado.');
            return;
          }
          this.user = response;
          this.createUserForm(this.user);
          resolve();
        },
        (error) => {
          console.error(`Erro ao buscar o usuário com ID ${id}:`, error);
          reject(error);
        }
      );
    });
  }

  createUserForm(user: IUser) {
    this.userForm = this.fb.group({
      name: [user?.name || '', [Validators.required]],
      phoneNumber: [
        user?.phoneNumber || '',
        [Validators.required, Validators.minLength(9)],
      ],
      cpf: [user?.cpf || '', [Validators.required]],
      email: [user?.email || '', [Validators.required, Validators.email]],
      password: [
        user?.password || '',
        [Validators.required, Validators.minLength(6)],
      ],
      confirmPassword: [
        user?.password || '',
        [Validators.required, Validators.minLength(6)],
      ],
    });
  }

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.loadData();
    } else {
      this.isLoading = false;
      this.createUserForm({} as IUser); // Inicialize com um objeto vazio
    }
  }

  openModalPassword(action: () => void) {
    this.actionToPerform = action;
    this.modalService.openModal();
    this.isModalPasswordOpen = true;
  }
  closeModalPassword() {
    this.modalService.closeModal();
    this.isModalPasswordOpen = false;
    this.confirmedPassword = '';
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  async onSubmit() {
    if (this.userForm.valid) {
      const apiUrl = 'https://backend-production-ff1f.up.railway.app/users';

      const formData = this.userForm.value;

      if (
        this.passwordStrength.hasMinLength &&
        this.passwordStrength.hasUppercase &&
        this.passwordStrength.hasLowercase &&
        this.passwordStrength.hasNumber &&
        this.passwordStrength.hasSpecialChar
      ) {
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
        this.showError('A senha não atende aos requisitos de segurança.');
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
      this.alertMessage =
        'Cuidado, errar a senha mais de 3 vezes irá bloquear a tela!';
      this.alertClass = 'alert alert-danger';
      this.alertTitle = 'Senha incorreta!';
      this.alertIconClass = 'bi bi-x-circle';
      this.showAlert = true;
      this.resetAlertAfterDelay();

      if (this.attemptCount >= 3) {
        // Fecha o modal e executa o logout após 3 tentativas falhas.
        this.router.navigate(['/realize-login']);
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
          this.alertMessage = 'Dados excluídos com sucesso!';
          this.alertClass = 'alert alert-success';
          this.alertTitle = 'Concluído';
          this.alertIconClass = 'bi bi-check-circle';
          this.showAlert = true;
          this.resetAlertAfterDelay();
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
