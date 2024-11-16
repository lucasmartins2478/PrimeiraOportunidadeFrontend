import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { JobService } from '../../services/job/job.service';
import { IJob } from '../../models/job.interface';
import { IApplication } from '../../models/application.interface'; // Adicione isso se você precisar de IApplication

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css',
})
export class ApplicationsComponent implements OnInit {
  jobs: IJob[] = [];
  filteredJobs: { job: IJob; applicationId: number }[] = []; // Armazena objetos com job e applicationId
  filteredIds: number[] = [];
  canceledJobs: IJob[] = [];
  finishedJobs: IJob[] = [];
  targetId = this.userService.getUserData()?.id;

  constructor(
    private userService: UserAuthService,
    private http: HttpClient,
    private jobService: JobService
  ) {}

  async getJobs(): Promise<void> {
    try {
      const response = await this.jobService.getVagas().toPromise();

      this.jobs = response || []; // Garante que jobs seja um array, mesmo que a resposta seja undefined
    } catch (error) {
      console.error('Erro ao buscar as vagas:', error);
      this.jobs = []; // Em caso de erro, inicializa como array vazio
    }
  }

  async getJobsId(): Promise<void> {
    try {
      const response = await this.jobService
        .getJobsByApplicationId(this.targetId)
        .toPromise();
      if (response) {
        // Filtra para garantir que o job não seja undefined antes de criar o objeto
        this.filteredJobs = response
          .map((application) => {
            const job = this.jobs.find(
              (job) => job.id === application.vacancyId
            );
            return job ? { job, applicationId: application.id } : null; // Retorna null se job for undefined
          })
          .filter((item) => item !== null) as {
          job: IJob;
          applicationId: number;
        }[]; // Filtra os nulls e força o tipo correto
        this.finishedJobs = this.jobs.filter((job) => job.isFilled == true && job.isActive == true)
      } else {
        this.filteredJobs = []; // Garante que filteredJobs seja um array válido
      }
    } catch (error) {
      console.error(`Erro ao buscar candidaturas: ${error}`);
      this.filteredJobs = []; // Em caso de erro, inicializa como array vazio
    }
  }

  // Filtra as vagas com base no applicationId e exibe as vagas associadas
  filterJobs(): void {
    // Aqui, já estamos passando tanto a vaga quanto o ID da candidatura
    this.filteredJobs = this.filteredJobs.filter(
      (item) => item.job !== undefined
    );
  }

  async ngOnInit(): Promise<void> {
    this.canceledJobs = this.jobService.getCanceledJobs();
    await this.getJobs();
    await this.getJobsId();
    this.filterJobs();
  }
}
