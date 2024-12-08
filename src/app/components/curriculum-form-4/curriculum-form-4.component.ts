import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/auth/auth.service';
import { ICurriculum } from '../../models/curriculum.interface';
import { CurriculumService } from '../../services/curriculum/curriculum.service';
import { IUser } from '../../models/user.interface';
import { UserFormService } from '../../services/user/user-form.service';
import { ModalService } from '../../services/modal/modal.service';

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
  confirmedPassword!: string;
  userId = this.userService.getUserData()?.id;
  user!: IUser;
  isModalPasswordOpen!: boolean;
  actionToPerform!: () => void;
  attemptCount: number = 0;
  isLoading: boolean = true;
  isModalTermsOfUseOpen!: boolean;
  isModalPrivacyPolicyOpen!: boolean;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userFormService: UserFormService,
    private userService: UserAuthService,
    private curriculumService: CurriculumService,
    private modalService: ModalService
  ) {}
  private async loadData(): Promise<void> {
    this.isLoading = true; // Define como true no início
    try {
      await this.getUserData();
      await this.getCurriculumData();
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
    } finally {
      this.isLoading = false; // Conclui o carregamento
    }
  }

  async getUserData(): Promise<void> {
    const id = this.userId;
    return new Promise<void>((resolve, reject) => {
      this.userFormService.getUserData(id).subscribe(
        (response: IUser) => {
          this.user = response;
          resolve();
        },
        (error) => {
          console.log(`Erro ao buscar o usuário com ID ${id}: ${error}`);
          reject(error);
        }
      );
    });
  }

  ngOnInit(): void {
    this.loadData();
  }
  openModalPassword(action: () => void) {
    this.modalService.openModal();
    this.actionToPerform = action;
    this.isModalPasswordOpen = true;
  }
  closeModalPassword() {
    this.modalService.closeModal();
    this.isModalPasswordOpen = false;
    this.confirmedPassword = '';
  }
  openModalTermsOfUse() {
    this.modalService.openModal()
    this.isModalTermsOfUseOpen = true
  }
  openModalPrivacyPolicy() {
    this.modalService.openModal()
    this.isModalPrivacyPolicyOpen = true
  }
  closeModalTermsOfUse() {
    this.modalService.closeModal()
    this.isModalTermsOfUseOpen = false
  }
  closeModalPrivacyPolicy() {
    this.modalService.closeModal()
    this.isModalPrivacyPolicyOpen = false
  }
  confirmPassword() {
    if (this.user.password === this.confirmedPassword) {
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
        this.userService.logout(); // Supondo que `logout` está no `authService`.
      }
    }
  }
  createForm() {
    this.adictionalDataForm = this.fb.group({
      attached: [''],
      description: [this.curriculumData.description || ''],
    });
  }

  async getCurriculumData(): Promise<void> {
    const id = this.userService.getUserData()?.id;
    return new Promise<void>((resolve, reject) => {
      this.curriculumService.getCurriculumData(id).subscribe(
        (response) => {
          this.curriculumData = response;
          this.createForm();
          resolve();
        },
        (error) => {
          console.error(`Erro ao buscar curriculo ${error}`);
          reject(error);
        }
      );
    });
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
          this.alertMessage = 'Cadastro de currículo finalizado!';
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
