import { Component, Input, OnInit } from '@angular/core';
import { IJob, IQuestion } from '../../models/job.interface';
import { UserAuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { IApplication } from '../../models/application.interface';
import { Router } from '@angular/router';
import { JobService } from '../../services/job/job.service';
import { QuestionsService } from '../../services/questions/questions.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  questionData!: IQuestion[];
  userData = this.authService.getUserData();
  userType: string | null = null;
  // Controle do modal
  isModalOpen = false;
  selectedJob: IJob | null = null;
  isModalQuestionOpen = false;
  respostas: string[] = [];

  constructor(
    private authService: UserAuthService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private jobService: JobService,
    private questionService: QuestionsService
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
  closeQuestionModal() {
    this.isModalQuestionOpen = false;
  }
  openQuestionModal() {
    this.isModalQuestionOpen = true;
  }
  editJob(jobId: number) {
    this.router.navigate(['/criar-vaga', jobId.toString()]);
  }
  cancelApplication() {
    this.applied = false;
    this.jobService.addCanceledJob(this.job); // Adiciona a vaga ao cancelado

    this.closeModal();

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
    const questions = await this.getQuestions(jobId.toString());

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
      if (questions !== undefined && questions.length > 0) {
        this.closeModal();
        this.openQuestionModal();

        this.respostas.forEach((resposta, index) => {
          const questionId = this.questionData[index].id; // Pega o id da pergunta correspondente
          const body = {
            answer: resposta,
            questionId: questionId, // Usa o questionId correto
            userId: this.userData?.id,
          };

          this.http
            .post(`https://backend-production-ff1f.up.railway.app/answer`, body)
            .subscribe(
              (response) => {
                const vacancyId = this.selectedJob?.id;
                const userId = this.userData?.id;

                const body = { userId, vacancyId };

                this.http
                  .post<IApplication>(
                    'https://backend-production-ff1f.up.railway.app/application',
                    body
                  )
                  .subscribe(
                    (response) => {
                      this.closeQuestionModal();
                      this.closeModal();
                      this.jobService.removeCanceledJob(jobId);
                      this.alertMessage =
                        'Parabéns, candidatura relizada com sucesso!';
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
              },
              (error) => {}
            );
        });
      } else {
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
              this.jobService.removeCanceledJob(jobId);
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
      }
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

  async getQuestions(jobId: string): Promise<IQuestion[] | undefined> {
    try {
      const response = await this.questionService
        .getQuestionsByJobId(jobId)
        .toPromise();
      if (Array.isArray(response)) {
        this.questionData = response;
        // Chama createForm somente depois de garantir que questionData está preenchido
        return response.filter(
          (question): question is IQuestion => question !== undefined
        );
      }
      return undefined;
    } catch (error) {
      console.error(`Erro ao buscar perguntas da vaga: ${error}`);
      return undefined;
    }
  }

  resetAlertAfterDelay() {
    setTimeout(() => (this.showAlert = false), 3000);
  }
}
