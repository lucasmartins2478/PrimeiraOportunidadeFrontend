import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAuthService } from '../../services/auth/auth.service';
import { IJob, IQuestion } from '../../models/job.interface';
import { JobService } from '../../services/job/job.service';
import { QuestionsService } from '../../services/questions/questions.service';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrl: './job-form.component.css',
})
export class JobFormComponent implements OnInit {
  alertMessage: string = '';
  alertTitle: string = '';
  alertClass: string = '';
  alertIconClass: string = '';
  showAlert: boolean = false;
  companyData = this.authService.getCompanyData();
  jobData!: IJob;
  questionData: IQuestion[] = [];
  jobId!: number | null;
  jobForm!: FormGroup;
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: UserAuthService,
    private route: ActivatedRoute,
    private jobService: JobService,
    private questionService: QuestionsService
  ) {
    // Inicializando o jobForm
  }
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.jobId = +idParam; // Converte `string` para `number`
      this.loadJobDataAndQuestions(idParam);
    } else {
      // Inicializa o formulário vazio para novo cadastro
      this.createEmptyForm();
    }
  }
  loadJobDataAndQuestions(id: string): void {
    this.jobService.getJobById(id).subscribe(
      (jobResponse) => {
        this.jobData = jobResponse;
        this.isEditing = !!this.jobData; // Atualiza a variável booleana com base nos dados de `jobData`
        this.questionService.getMessagesByJobId(id).subscribe(
          (questionsResponse) => {
            this.questionData = Array.isArray(questionsResponse)
              ? questionsResponse
              : questionsResponse
              ? [questionsResponse]
              : [];

            this.createForm(); // Cria o formulário com os dados de jobData e perguntas
          },
          (error) => {
            console.error(`Erro ao buscar perguntas: ${error}`);
            this.createForm(); // Cria o formulário mesmo que falhe ao buscar perguntas
          }
        );
      },
      (error) => {
        console.error(`Erro ao buscar a vaga: ${error}`);
        this.isEditing = false; // Se não houver dados, define como falso
        this.createForm();
      }
    );
  }

  createEmptyForm(): void {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required]],
      modality: ['', [Validators.required]],
      locality: ['', [Validators.required]],
      uf: ['', [Validators.required]],
      contact: [this.companyData?.email, [Validators.required]],
      salary: ['', [Validators.required, Validators.maxLength(11)]],
      toAgree: [false],
      level: ['', [Validators.required]],
      description: [''],
      requirements: ['', [Validators.required]],
      aboutCompany: ['', [Validators.required]],
      benefits: ['', [Validators.required]],
      perguntas: this.fb.array([this.criarPergunta()]), // Formulário em branco inicia com uma pergunta vazia
    });
  }

  createForm(): void {
    const perguntasArray = this.fb.array(
      this.questionData.length > 0
        ? this.questionData.map((q) => this.fb.control(q.question || ''))
        : [this.criarPergunta()] // Adiciona uma pergunta vazia se não houver perguntas
    );

    this.jobForm = this.fb.group({
      title: [this.jobData.title || '', [Validators.required]],
      modality: [this.jobData.modality || '', [Validators.required]],
      locality: [this.jobData.locality || '', [Validators.required]],
      uf: [this.jobData.uf || '', [Validators.required]],
      contact: [this.companyData?.email, [Validators.required]],
      salary: [
        this.jobData.salary || '',
        [Validators.required, Validators.maxLength(11)],
      ],
      toAgree: [false],
      level: [this.jobData.level || '', [Validators.required]],
      description: [this.jobData.description || ''],
      requirements: [this.jobData.requirements || '', [Validators.required]],
      aboutCompany: [this.jobData.aboutCompany || '', [Validators.required]],
      benefits: [this.jobData.benefits || '', [Validators.required]],
      perguntas: perguntasArray, // Array de perguntas preenchido dinamicamente
    });
  }

  // Método para criar um novo campo de pergunta
  criarPergunta() {
    return this.fb.control('');
  }

  // Método para adicionar um novo campo de pergunta
  adicionarPergunta() {
    this.perguntas.push(this.criarPergunta());
  }

  // Getter para acessar o FormArray de perguntas
  get perguntas(): FormArray {
    return this.jobForm.get('perguntas') as FormArray;
  }

  // Método chamado quando o formulário for enviado
  onSubmit() {
    if (this.jobForm.valid) {
      const apiUrl = 'http://localhost:3333/vacancy';
      const formData = this.jobForm.value;

      const body = {
        title: formData.title,
        modality: formData.modality,
        locality: formData.locality,
        uf: formData.uf,
        contact: formData.contact,
        salary: formData.salary,
        level: formData.level,
        description: formData.description,
        requirements: formData.requirements,
        aboutCompany: formData.aboutCompany,
        benefits: formData.benefits,
        companyName: this.companyData?.name,
        companyId: this.companyData?.id,
      };

      // console.log(formData.perguntas)

      this.http.post<IJob>(apiUrl, body).subscribe(
        (response) => {
          this.alertMessage = 'Vaga criada com sucesso!';
          this.alertClass = 'alert alert-success';
          this.alertTitle = 'Sucesso';
          this.alertIconClass = 'bi bi-check-circle';
          this.showAlert = true;
          this.resetAlertAfterDelay();
          setTimeout(() => {
            this.enviarPerguntas(response.id);
            this.router.navigate(['/minhas-vagas']);
          }, 2000);
        },
        (error) => {
          window.alert(`Erro ao cadastrar vaga: ${error}`);
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
    const id = this.jobData.id;
    if (this.jobForm.valid) {
      const apiUrl = 'http://localhost:3333/vacancy';
      const formData = this.jobForm.value;

      const body = {
        title: formData.title,
        modality: formData.modality,
        locality: formData.locality,
        uf: formData.uf,
        contact: formData.contact,
        salary: formData.salary,
        level: formData.level,
        description: formData.description,
        requirements: formData.requirements,
        aboutCompany: formData.aboutCompany,
        benefits: formData.benefits,
        companyName: this.companyData?.name,
        companyId: this.companyData?.id,
      };

      this.http.put<IJob>(`${apiUrl}/${id}`, body).subscribe(
        (response) => {
          this.alertMessage = 'Vaga atualizada com sucesso!';
          this.alertClass = 'alert alert-success';
          this.alertTitle = 'Sucesso';
          this.alertIconClass = 'bi bi-check-circle';
          this.showAlert = true;
          this.resetAlertAfterDelay();

          // Atualiza ou adiciona perguntas
          setTimeout(() => {
            this.enviarPerguntas(id);
            this.router.navigate(['/minhas-vagas']);
          }, 2000);
        },
        (error) => {
          window.alert(`Erro ao atualizar a vaga: ${error}`);
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

  enviarPerguntas(vacancyId: number) {
    const questions = this.perguntas.value; // Obtém o array de perguntas do formulário
    const apiUrl = 'http://localhost:3333/vacancy/questions'; // Altere conforme sua API

    // Atualiza ou adiciona perguntas existentes
    questions.forEach((pergunta: string, index: number) => {
      if (this.questionData[index]) {
        // Atualiza pergunta existente
        const questionId = this.questionData[index].id;
        this.http
          .put(
            `http://localhost:3333/vacancy/${this.jobData.id}/questions/${questionId}`,
            { question: pergunta, vacancyId }
          )
          .subscribe(
            (response) => {
              console.log(
                `Pergunta ${index + 1} atualizada com sucesso:`,
                response
              );
            },
            (error) => {
              console.error(
                `Erro ao atualizar a pergunta ${index + 1}:`,
                error
              );
            }
          );
      } else {
        // Adiciona nova pergunta
        const body = {
          question: pergunta,
          vacancyId,
        };

        this.http.post(apiUrl, body).subscribe(
          (response) => {
            console.log('Pergunta enviada com sucesso:', response);
          },
          (error) => {
            console.error('Erro ao enviar pergunta:', error);
          }
        );
      }
    });
  }

  // Método para exibir o alerta e fechá-lo automaticamente após 3 segundos
  resetAlertAfterDelay() {
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  // Método para limpar o alerta manualmente
  clearAlert() {
    this.alertMessage = '';
    this.showAlert = false;
  }
}
