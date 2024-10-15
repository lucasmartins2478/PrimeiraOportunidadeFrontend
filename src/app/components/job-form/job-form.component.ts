import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/auth/auth.service';
import { IJob } from '../../models/job.interface';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrl: './job-form.component.css',
})
export class JobFormComponent {
  alertMessage: string = '';
  alertType: 'success' | 'danger' = 'success';
  showAlert: boolean = false;
  companyData = this.authService.getCompanyData();

  jobForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: UserAuthService
  ) {
    // Inicializando o jobForm
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
      perguntas: this.fb.array([this.criarPergunta()]), // Array de perguntas
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
        companyId: this.companyData?.id,
      };

      // console.log(formData.perguntas)

      this.http.post<IJob>(apiUrl, body).subscribe(
        (response) => {
          this.alertMessage = 'Vaga criada com sucesso!';
          this.alertType = 'success';
          this.showAlert = true;
          this.resetAlertAfterDelay();
          console.log(response);
          this.enviarPerguntas(response.id);
          this.router.navigate(['/minhas-vagas']);
        },
        (error) => {
          window.alert(`Erro ao cadastrar vaga: ${error}`);
        }
      );
    } else {
      this.alertMessage = 'Formulário inválido';
      this.alertType = 'danger';
      this.showAlert = true;
      this.resetAlertAfterDelay();
    }
  }

  enviarPerguntas(vacancyId: number) {
    const questions = this.perguntas.value; // Obtém o array de perguntas do formulário
    const ApiUrl = 'http://localhost:3333/vacancy/questions'; // Altere conforme sua API

    questions.forEach((pergunta: string) => {
      const body = {
        question: pergunta, // A pergunta em si
        vacancyId, // ID da vaga relacionada
      };

      // Faz uma requisição POST para salvar cada pergunta
      this.http.post(ApiUrl, body).subscribe(
        (response) => {
          console.log('Pergunta enviada com sucesso:', response);
        },
        (error) => {
          console.error('Erro ao enviar pergunta:', error);
        }
      );
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
