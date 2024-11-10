import { Component, Input, OnInit } from '@angular/core';
import { IJob } from '../../models/job.interface';
import { UserAuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { IApplication } from '../../models/application.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css'],
})
export class JobCardComponent implements OnInit {
  @Input() job!: IJob;

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

  constructor(private authService: UserAuthService, private http: HttpClient, private router : Router) {}

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
  editJob(jobId: number){
    this.router.navigate(['/criar-vaga', jobId.toString()]);
  }

  async apply() {
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
        .post<IApplication>('http://localhost:3333/application', body)
        .subscribe(
          (response) => {
            this.closeModal()
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
        .get(`http://localhost:3333/curriculum/${id}`)
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
