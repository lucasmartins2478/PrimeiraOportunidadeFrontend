import { Component, Input, OnInit } from '@angular/core';
import { IAnswer, IJob, IQuestion } from '../../models/job.interface';
import { UserAuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { IApplication } from '../../models/application.interface';
import { Router } from '@angular/router';
import { JobService } from '../../services/job/job.service';
import { QuestionsService } from '../../services/questions/questions.service';
import { FormBuilder } from '@angular/forms';
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
import { ICompany } from '../../models/company.interface';
import { companyFormService } from '../../services/company/company-form.service';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css'],
})
export class JobCardComponent implements OnInit {
  @Input() job!: IJob;
  @Input() applied: boolean = false;
  @Input() companyName!: string;

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
  companyData = this.authService.getCompanyData();
  isModalQuestionOpen = false;
  isModalApplicationOpen!: boolean;
  company!: ICompany;
  isModalCurriculumOpen!: boolean;
  respostas: string[] = [];
  applications: IApplication[] = [];
  userData: { [key: number]: IUser } = {};
  selectedUserId: number | null = null; // ID do usuário selecionado
  selectedUserCurriculum: ICurriculum | null = null;
  selectedAcademicData: IAcademicData[] = [];
  selectedCoursesData: ICoursesData[] = [];
  selectedCompetences: ICompetences[] = [];
  questions: IQuestion[] = [];
  answers: IAnswer[] = [];
  confirmedPassword!: string;
  isModalPasswordOpen!: boolean;
  actionToPerform!: () => void;
  user!: IUser;
  attemptCount: number = 0;
  answerWithQuestion: any = [];
  modalStates: { [key: string]: boolean } = {};
  modalParameters: { [key: string]: any } = {};

  constructor(
    private authService: UserAuthService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserFormService,
    private companyService: companyFormService,
    private curriculumService: CurriculumService,
    private jobService: JobService,
    private questionService: QuestionsService,
    private answerService: AnswersService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.userType = this.authService.getUserType();
  }
  getUser() {
    const id = this.userId;
    this.userService.getUserData(id).subscribe(
      (response: IUser) => {
        this.user = response;
      },
      (error) => {
        console.log(`Erro ao buscar o usuário com ID ${id}: ${error}`);
      }
    );
  }

  getCompanyData() {
    if (this.companyData?.id) {
      this.companyService.getUserData(this.companyData.id).subscribe(
        (data) => {
          this.company = data; // Atribui os dados retornados à propriedade
        },
        (error) => {
          console.error(`Erro ao buscar os dados da empresa: ${error}`);
        }
      );
    } else {
      console.error('ID da empresa não definido');
    }
  }
  prepareModalPassword(action: (...args: any[]) => void, ...params: any[]) {
    this.openModalPassword(() => action.apply(this, params));
  }

  // Abre o modal e define o job selecionado
  openModal(job: IJob) {
    if (!this.authService.isAuthenticated()) {
      this.alertMessage =
        'Você precisa estar logado para acessar mais informações!';
      this.alertClass = 'alert alert-warning';
      this.alertTitle = 'Ops!';
      this.alertIconClass = 'bi bi-exclamation-circle';
      this.showAlert = true;
      this.resetAlertAfterDelay();
      return;
    }
    this.selectedJob = job;
    this.modalService.openModal();
    this.isModalOpen = true;
  }
  confirmPassword() {
    if (this.userType === 'user') {
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
          this.authService.logout(); // Supondo que `logout` está no `authService`.
        }
      }
    } else if (this.userType === 'company') {
      if (this.company.password === this.confirmedPassword) {
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
  }
  openModalPassword(action: () => void) {
    if (this.userType === 'user') {
      this.getUser();
    } else if (this.userType === 'company') {
      this.getCompanyData();
    }
    this.closeApplicationModal();
    this.closeCurriculumModal();
    this.closeModal();
    this.actionToPerform = action;
    this.isModalPasswordOpen = true;
  }
  closeModalPassword() {
    this.modalService.closeModal();
    this.isModalPasswordOpen = false;
    this.confirmedPassword = '';
  }

  // Fecha o modal
  closeModal() {
    this.modalService.closeModal();
    this.isModalOpen = false;
  }
  closeQuestionModal() {
    this.modalService.closeModal();
    this.isModalQuestionOpen = false;
  }
  openQuestionModal() {
    this.modalService.openModal();
    this.isModalQuestionOpen = true;
  }
  openCurriculumModal() {
    this.modalService.openModal();
    this.isModalCurriculumOpen = true;
  }
  closeCurriculumModal() {
    this.modalService.closeModal();
    this.isModalCurriculumOpen = false;
  }
  openApplicationModal(jobId: number) {
    this.getApplications(jobId.toString())
      .then((applications) => {})
      .catch((error) => {});
    this.modalService.openModal();
    this.isModalApplicationOpen = true;
  }
  closeApplicationModal() {
    this.modalService.closeModal();
    this.isModalApplicationOpen = false;
  }
  editJob(jobId: number) {
    this.router.navigate(['/criar-vaga', jobId.toString()]);
  }
  cancelApplication(jobId: number) {
    this.applied = false;
    this.jobService.addCanceledJob(this.job); // Adiciona a vaga ao cancelado

    this.closeModal();

    // Agora, usamos o ID da candidatura (não o da vaga)
    this.http
      .delete<IApplication>(
        `https://backend-production-ff1f.up.railway.app/application/${this.userId}/${jobId}`
      )
      .subscribe(
        (response) => {
          this.closeModal();
          this.alertMessage = 'Vaga cancelada com sucesso!.';
          this.alertClass = 'alert alert-success';
          this.alertTitle = 'Sucesso';
          this.alertIconClass = 'bi bi-check-circle';
          this.showAlert = true;
          this.resetAlertAfterDelay();
        },
        (error) => {
          console.error('Erro ao remover a candidatura:', error);
        }
      );

    const body = {
      vacancyId: jobId,
      userId: this.userId,
    };
    this.http
      .post(
        `https://backend-production-ff1f.up.railway.app/cancelledApplication`,
        body
      )
      .subscribe(
        (response) => {
          console.log('candidatura adicionada com sucesso');
        },
        (error) => [console.error(`Erro ao adicionar candidatura cancelada`)]
      );
    setTimeout(() => {
      window.location.reload();
    }, 3000);
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
          this.alertMessage = 'Vaga finalizada com sucesso!.';
          this.alertClass = 'alert alert-success';
          this.alertTitle = 'Sucesso';
          this.alertIconClass = 'bi bi-check-circle';
          this.showAlert = true;
          this.resetAlertAfterDelay();
        },
        (error) => {
          console.error(`Erro ao finalizar vaga ${error}`);
        }
      );
  }
  cancelJob(jobId: number) {
    const body = {
      isActive: false,
    };
    this.http
      .put<IJob>(
        `https://backend-production-ff1f.up.railway.app/vacancyIsActive/${jobId}`,
        body
      )
      .subscribe(
        (response) => {
          this.closeModal();
          this.alertMessage = 'Vaga cancelada com sucesso!';
          this.alertClass = 'alert alert-success';
          this.alertTitle = 'Concluído';
          this.alertIconClass = 'bi bi-check-circle';
          this.showAlert = true;
          this.resetAlertAfterDelay();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
        (error) => {
          console.error(`Erro ao finalizar vaga ${error}`);
        }
      );
  }

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

  getAnswersForQuestion(questionId: number) {
    this.answerService.getAnswerOfQuestion(questionId).subscribe(
      (answers) => {
        // Associando as respostas de uma pergunta específica
        this.answers = answers;
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

    await this.getQuestions(this.job.id.toString());
    this.answerWithQuestion = []; // Certifique-se de inicializar o array

    this.questionData.forEach((question) => {
      this.answerService.getAnswerOfQuestion(question.id).subscribe(
        (responses) => {
          responses.forEach((answer) => {
            if (
              userId === answer.userId &&
              question.id === answer.questionId &&
              question.vacancyId == this.job.id
            ) {
              this.answerWithQuestion.push({
                question: question.question,
                answer: answer.answer,
              });
            }
          });
        },
        (error) => {
          console.error(
            `Erro ao buscar resposta para a pergunta ${question.id}:`,
            error
          );
        }
      );
    });

    // Exibe o modal do currículo
    this.openCurriculumModal();
  }

  async submitAnswers(jobId: number) {
    try {
      // Itera pelas respostas fornecidas no formulário
      for (const [index, resposta] of this.respostas.entries()) {
        // Obtém o ID da pergunta associada ao índice atual
        const questionId = this.questions[index]?.id;

        if (!questionId || !resposta) {
          console.warn(
            `Pergunta ou resposta ausente para o índice ${index}: Ignorando envio.`
          );
          continue; // Pula perguntas/respostas inválidas
        }

        // Monta o corpo da requisição para salvar a resposta
        const answerBody = {
          answer: resposta,
          questionId: questionId,
          userId: this.userId,
        };

        // Envia a resposta ao backend
        await this.http
          .post(
            'https://backend-production-ff1f.up.railway.app/answer',
            answerBody
          )
          .toPromise();

        console.log(
          `Resposta para a pergunta ${questionId} enviada com sucesso.`
        );
      }

      // Após enviar todas as respostas, cria a candidatura
      const applicationBody = { userId: this.userId, vacancyId: jobId };
      this.http
        .delete(
          `https://backend-production-ff1f.up.railway.app/cancelledApplication/${this.userId}/${jobId}`
        )
        .subscribe(
          (response) => {
            console.log('candidatura adicionada com sucesso');
          },
          (error) => [console.error(`Erro ao adicionar candidatura cancelada`)]
        );

      await this.http
        .post<IApplication>(
          'https://backend-production-ff1f.up.railway.app/application',
          applicationBody
        )
        .toPromise();

      // Exibe mensagem de sucesso e limpa os modais
      this.closeQuestionModal();
      this.closeModal();
      this.jobService.removeCanceledJob(this.job.id);
      this.alertMessage = 'Parabéns, candidatura realizada com sucesso!';
      this.alertClass = 'alert alert-success';
      this.alertTitle = 'Sucesso';
      this.alertIconClass = 'bi bi-check-circle';
      this.showAlert = true;
      this.resetAlertAfterDelay();
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error(`Erro ao enviar respostas ou candidatura:`, error);
      this.alertMessage = 'Ocorreu um erro ao realizar a candidatura.';
      this.alertClass = 'alert alert-danger';
      this.alertTitle = 'Erro';
      this.alertIconClass = 'bi bi-exclamation-triangle';
      this.showAlert = true;
      this.resetAlertAfterDelay();
    }
  }

  async apply(jobId: number) {
    await this.getQuestions(jobId.toString());

    const vacancyId = this.selectedJob?.id;
    const userId = this.userId;

    if (userId !== undefined && vacancyId !== undefined) {
      const isVerified = await this.verifyApplication(userId, vacancyId);

      if (isVerified) {
        // Código a ser executado se a verificação for verdadeira
        this.closeModal();
        this.closeQuestionModal();
        this.alertMessage = 'Você já se candidatou a essa vaga.';
        this.alertClass = 'alert alert-danger';
        this.alertTitle = 'Erro';
        this.alertIconClass = 'bi bi-x-circle';
        this.showAlert = true;
        this.resetAlertAfterDelay();
        return; // Retorna para cancelar a operação
      }
    }

    if (!this.userId) {
      this.alertMessage = 'Você precisa estar logado para se candidatar.';
      this.alertClass = 'alert alert-danger';
      this.alertTitle = 'Erro';
      this.alertIconClass = 'bi bi-x-circle';
      this.showAlert = true;
      this.resetAlertAfterDelay();
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      return;
    }

    const exist = await this.checkCurriculum();
    console.log(exist);

    if (exist) {
      if (this.questionData !== undefined && this.questionData.length > 0) {
        this.questions = [];
        this.questionData.forEach((question) => {
          if (question.vacancyId === jobId) {
            this.questions.push(question);
          }
        });
        if (this.questions.length >= 1) {
          this.closeModal();
          this.openQuestionModal();
          return;
        } else {
          const applicationBody = { userId, vacancyId };

          this.http
            .delete(
              `https://backend-production-ff1f.up.railway.app/cancelledApplication/${userId}/${vacancyId}`
            )
            .subscribe(
              (response) => {
                console.log('candidatura adicionada com sucesso');
              },
              (error) => [
                console.error(`Erro ao adicionar candidatura cancelada`),
              ]
            );

          this.http
            .post(
              'https://backend-production-ff1f.up.railway.app/application',
              applicationBody
            )
            .subscribe(
              (response) => {
                this.closeQuestionModal();
                this.closeModal();
                this.jobService.removeCanceledJob(jobId);
                this.alertMessage =
                  'Parabéns, candidatura realizada com sucesso!';
                this.alertClass = 'alert alert-success';
                this.alertTitle = 'Sucesso';
                this.alertIconClass = 'bi bi-check-circle';
                this.showAlert = true;
                this.resetAlertAfterDelay();
                return;
              },
              (error) => {}
            );
        }
      } else {
        const body = { userId, vacancyId };

        try {
          await this.http
            .post<IApplication>(
              'https://backend-production-ff1f.up.railway.app/application',
              body
            )
            .toPromise();
          this.closeModal();
          this.jobService.removeCanceledJob(jobId);
          this.alertMessage = 'Parabéns, candidatura realizada com sucesso!';
          this.alertClass = 'alert alert-success';
          this.alertTitle = 'Sucesso';
          this.alertIconClass = 'bi bi-check-circle';
          this.showAlert = true;
          this.resetAlertAfterDelay();
        } catch (error) {
          console.error(`Erro ao adicionar candidatura: ${error}`);
        }
      }
    } else {
      this.alertMessage = 'Primeiro você precisa criar um currículo';
      this.alertClass = 'alert alert-warning';
      this.alertTitle = 'Erro';
      this.alertIconClass = 'bi bi-exclamation-circle';
      this.showAlert = true;
      this.resetAlertAfterDelay();
      return;
    }
  }

  async checkCurriculum(): Promise<boolean> {
    const user = this.authService.getUserData();

    if (user?.curriculumId !== null) {
      return true;
    } else {
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
  private closeModals() {
    this.closeModal();
    this.closeQuestionModal();
  }
}
