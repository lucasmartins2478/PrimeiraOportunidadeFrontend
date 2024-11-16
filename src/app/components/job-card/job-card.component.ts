import { Component, Input, OnInit } from '@angular/core';
import { IJob } from '../../models/job.interface';
import { UserAuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { IApplication } from '../../models/application.interface';
import { Router } from '@angular/router';
import { JobService } from '../../services/job/job.service';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css'],
})
export class JobCardComponent implements OnInit {
  @Input() job!: IJob;
  @Input() applied!: boolean;
  @Input() applicationId!: number;

  alertMessage: string = '';
  alertTitle: string = '';
  alertClass: string = '';
  alertIconClass: string = '';
  showAlert: boolean = false;

  userData = this.authService.getUserData();
  userType: string | null = null;

  // Controle do modal
  isModalOpen = false;
  selectedJob: IJob | null = null;

  constructor(
    private authService: UserAuthService,
    private http: HttpClient,
    private router: Router,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.userType = this.authService.getUserType();
  }

  // Abre o modal e define o job selecionado
  openModal(job: IJob) {
    this.selectedJob = job;
    this.isModalOpen = true;
  }

  // Fecha o modal
  closeModal() {
    this.isModalOpen = false;
  }
  editJob(jobId: number) {
    this.router.navigate(['/criar-vaga', jobId.toString()]);
  }
  cancelApplication() {
    this.applied = false;
    this.jobService.addCanceledJob(this.job); // Adiciona a vaga ao cancelado

    this.closeModal()

    // Agora, usamos o ID da candidatura (não o da vaga)
    this.http
      .delete<IApplication>(
        `https://backend-production-ff1f.up.railway.app/application/${this.applicationId}`
      )
      .subscribe(
        (response) => {
          console.log('Candidatura removida com sucesso:', response);
        },
        (error) => {
          console.error('Erro ao remover a candidatura:', error);
        }
      );
  }
  finishJob(jobId: number) {
    const body = {
      isFilled: true,
    };
    this.http
      .put<IJob>(
        `https://backend-production-ff1f.up.railway.app/vacancyIsFilled/${jobId}`,
        body
      )
      .subscribe(
        (response) => {
          this.closeModal();
          this.alertMessage = 'Você precisa estar logado para se candidatar.';
          this.alertClass = 'alert alert-danger';
          this.alertTitle = 'Erro';
          this.alertIconClass = 'bi bi-x-circle';
          this.showAlert = true;
          this.resetAlertAfterDelay();
        },
        (error) => {
          console.error(`Erro ao finalizar vaga ${error}`);
        }
      );
  }
  cancelJob(jobId: number) {}

  async apply(jobId: number) {
    if (!this.userData) {
      this.alertMessage = 'Você precisa estar logado para se candidatar.';
      this.alertClass = 'alert alert-danger';
      this.alertTitle = 'Erro';
      this.alertIconClass = 'bi bi-x-circle';
      this.showAlert = true;
      this.resetAlertAfterDelay();
      return;
    }

    const exist = await this.checkCurriculum(this.userData.id);

    if (exist) {
      const vacancyId = this.selectedJob?.id;
      const userId = this.userData.id;

      const body = { userId, vacancyId };

      this.http
        .post<IApplication>(
          'https://backend-production-ff1f.up.railway.app/application',
          body
        )
        .subscribe(
          (response) => {
            this.closeModal();
            this.jobService.removeCanceledJob(jobId)
            this.alertMessage = 'Parabéns, candidatura relizada com sucesso!';
            this.alertClass = 'alert alert-success';
            this.alertTitle = 'Sucesso';
            this.alertIconClass = 'bi bi-check-circle';
            this.showAlert = true;
            this.resetAlertAfterDelay();
          },
          (error) => {
            console.log(`Erro ao adicionar candidatura ${error}`);
          }
        );
    } else {
      this.closeModal();
      this.alertMessage = 'Você precisa ter um currículo cadastrado.';
      this.alertClass = 'alert alert-danger';
      this.alertTitle = 'Erro';
      this.alertIconClass = 'bi bi-x-circle';
      this.showAlert = true;
      this.resetAlertAfterDelay();
    }
  }

  async checkCurriculum(id: number): Promise<boolean> {
    try {
      const response = await this.http
        .get(`https://backend-production-ff1f.up.railway.app/curriculum/${id}`)
        .toPromise();
      return !!response;
    } catch (error) {
      console.error(`Erro ao buscar currículo: ${error}`);
      return false;
    }
  }

  resetAlertAfterDelay() {
    setTimeout(() => (this.showAlert = false), 3000);
  }
}
