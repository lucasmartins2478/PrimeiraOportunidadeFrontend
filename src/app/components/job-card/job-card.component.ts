import { Component, Input, OnInit } from '@angular/core';
import { IAnswer, IJob, IQuestion } from '../../models/job.interface';
import { UserAuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { IApplication } from '../../models/application.interface';
import { Router } from '@angular/router';
import { JobService } from '../../services/job/job.service';
import { QuestionsService } from '../../services/questions/questions.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserFormService } from '../../services/user/user-form.service';
import { CurriculumService } from '../../services/curriculum/curriculum.service';
import { IUser } from '../../models/user.interface';
import {
  IAcademicData,
  ICompetences,
  ICoursesData,
  ICurriculum,
} from '../../models/curriculum.interface';
import { AnswersService } from '../../services/answers/answers.service';

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
  userId = this.authService.getUserData()?.id;
  userType: string | null = null;
  isModalOpen = false;
  selectedJob: IJob | null = null;
  isModalQuestionOpen = false;
  isModalApplicationOpen!: boolean;
  isModalCurriculumOpen!: boolean;
  respostas: string[] = [];
  applications: IApplication[] = [];
  userData: { [key: number]: IUser } = {};
  selectedUserId: number | null = null; // ID do usuário selecionado
  selectedUserCurriculum: ICurriculum | null = null;
  selectedAcademicData: IAcademicData[] = [];
  selectedCoursesData: ICoursesData[] = [];
  selectedCompetences: ICompetences[] = [];
  questions: { question: IQuestion }[] = [];
  answers!: IAnswer;

  constructor(
    private authService: UserAuthService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserFormService,
    private curriculumService: CurriculumService,
    private jobService: JobService,
    private questionService: QuestionsService,
    private answerService: AnswersService
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
  openCurriculumModal() {
    this.isModalCurriculumOpen = true;
  }
  closeCurriculumModal() {
    this.isModalCurriculumOpen = false;
  }
  openApplicationModal(jobId: number) {
    this.getApplications(jobId.toString())
      .then((applications) => {})
      .catch((error) => {});
    this.isModalApplicationOpen = true;
  }
  closeApplicationModal() {
    this.isModalApplicationOpen = false;
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

  getUserData(userId: number) {
    this.userService.getUserData(userId).subscribe(
      (response) => {
        this.userData[userId] = response; // Armazena todos os dados retornados
      },
      (error) => {
        console.error(`Erro ao buscar dados do usuário: ${error}`);
      }
    );
  }

  getAnswerForQuestion(userId: number, questionId: number) {
    this.answerService.getAnswerOfQuestion(questionId, userId).subscribe(
      (answer) => {
        if (answer) {
          this.answers = answer;
        } else {
          console.log('Nenhuma resposta encontrada para este usuário.');
        }
      },
      (error) => {
        console.error('Erro ao buscar resposta:', error);
      }
    );
  }

  async createUserCurriculum(userId: number) {
    this.selectedUserId = userId; // Armazena o ID do candidato selecionado
    this.closeApplicationModal();
    this.curriculumService.getCurriculumData(userId).subscribe(
      (response) => {
        this.selectedUserCurriculum = response;
      },
      (error) => {
        console.error(
          `Erro ao buscar currículo do usuário ${userId}: ${error}`
        );
      }
    );

    // Carrega os dados acadêmicos
    this.curriculumService.getAcademicData(userId).subscribe(
      (response) => {
        this.selectedAcademicData = response || [];
      },
      (error) => {
        console.error(
          `Erro ao buscar dados acadêmicos do usuário ${userId}: ${error}`
        );
      }
    );

    // Carrega os cursos
    this.curriculumService.getCoursesData(userId).subscribe(
      (response) => {
        this.selectedCoursesData = response || [];
      },
      (error) => {
        console.error(`Erro ao buscar cursos do usuário ${userId}: ${error}`);
      }
    );

    // Carrega as competências
    this.curriculumService.getCompetences(userId).subscribe(
      (response) => {
        this.selectedCompetences = response || [];
      },
      (error) => {
        console.error(
          `Erro ao buscar competências do usuário ${userId}: ${error}`
        );
      }
    );

    const questions = await this.getQuestions(this.job.id.toString());
    if (questions) {
      // Associe as perguntas às respostas do candidato (simulação de resposta para demonstração)
      this.questions = questions.map((question) => ({
        question,
        answer: this.getAnswerForQuestion(userId, question.id), // Simula a obtenção da resposta
      }));
    }

    // Exibe o modal do currículo
    this.openCurriculumModal();
  }

  async apply(jobId: number) {
    try {
      const vacancyId = this.selectedJob?.id;
      const userId = this.userId;

      if (!userId) {
        this.showAlertMessage(
          'Você precisa estar logado para se candidatar.',
          'Erro',
          'alert alert-danger',
          'bi bi-x-circle'
        );
        return;
      }

      if (!vacancyId) {
        console.error('ID da vaga não encontrado.');
        return;
      }

      // Verificar se o usuário já se candidatou
      const isVerified = await this.verifyApplication(userId, vacancyId);
      if (isVerified) {
        this.showAlertMessage(
          'Você já se candidatou a essa vaga.',
          'Erro',
          'alert alert-danger',
          'bi bi-x-circle'
        );
        return;
      }

      // Verificar se o currículo existe
      const hasCurriculum = await this.checkCurriculum(userId);
      if (!hasCurriculum) {
        this.showAlertMessage(
          'É necessário ter um currículo cadastrado para se candidatar.',
          'Erro',
          'alert alert-danger',
          'bi bi-x-circle'
        );
        return;
      }

      // Obter perguntas associadas à vaga
      const questions = await this.getQuestions(jobId.toString());

      if (questions && questions.length > 0) {
        // Abrir modal para responder perguntas
        this.closeModal();
        this.openQuestionModal();

        // Salvar respostas
        for (const [index, resposta] of this.respostas.entries()) {
          const questionId = this.questionData[index]?.id;
          if (questionId) {
            const answerBody = {
              answer: resposta,
              questionId,
              userId,
            };

            await this.http
              .post(
                'https://backend-production-ff1f.up.railway.app/answer',
                answerBody
              )
              .toPromise();
          }
        }
      }

      // Salvar candidatura
      const applicationBody = { userId, vacancyId };
      await this.http
        .post<IApplication>(
          'https://backend-production-ff1f.up.railway.app/application',
          applicationBody
        )
        .toPromise();

      // Sucesso: Fechar modais e exibir mensagem
      this.closeModal();
      this.closeQuestionModal();
      this.jobService.removeCanceledJob(jobId);
      this.showAlertMessage(
        'Parabéns, candidatura realizada com sucesso!',
        'Sucesso',
        'alert alert-success',
        'bi bi-check-circle'
      );
    } catch (error) {
      console.error(`Erro ao realizar candidatura: ${error}`);
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

  async verifyApplication(userId: number, jobId: number): Promise<boolean> {
    try {
      const response = await this.http
        .get<IApplication[]>(
          `https://backend-production-ff1f.up.railway.app/applications/${userId}`
        )
        .toPromise();

      // Verifica se a resposta existe e contém itens
      if (response && response.length > 0) {
        return response.some((application) => application.vacancyId === jobId);
      }

      // Se a resposta for `undefined` ou um array vazio, retorna `false`
      return false;
    } catch (error) {
      console.error(`Erro ao verificar candidatura: ${error}`);
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

  async getApplications(jobId: string): Promise<IApplication[] | undefined> {
    try {
      const response = await this.jobService
        .getApplicationsByJobId(Number(jobId))
        .toPromise();
      if (Array.isArray(response)) {
        this.applications = response;
        this.applications.forEach((application) => {
          this.getUserData(application.userId);
        });
        return response.filter(
          (application): application is IApplication =>
            application !== undefined
        );
      }
      return undefined;
    } catch (error) {
      console.error(`Erro ao buscar candidaturas ${error}`);
      return undefined;
    }
  }
  private showAlertMessage(
    message: string,
    title: string,
    cssClass: string,
    iconClass: string
  ) {
    this.alertMessage = message;
    this.alertClass = cssClass;
    this.alertTitle = title;
    this.alertIconClass = iconClass;
    this.showAlert = true;
    this.resetAlertAfterDelay();
  }

  resetAlertAfterDelay() {
    setTimeout(() => (this.showAlert = false), 3000);
  }
}
