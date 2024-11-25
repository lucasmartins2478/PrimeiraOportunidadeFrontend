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
  jobs: IJob[]  = [];
  filteredJobs: IJob[] = []; // Armazena objetos com job e applicationId
  filteredIds: number[] = [];
  canceledJobs: IJob[] = [];
  finishedJobs: IJob[] = [];
  searchedJobs: IJob[] = []
  targetId = this.userService.getUserData()?.id;

  constructor(
    private userService: UserAuthService,
    private http: HttpClient,
    private jobService: JobService
  ) {}

  // Método para buscar todas as vagas e filtrar as candidaturas
  async fetchJobs(): Promise<void> {
    try {
      // Buscar todas as vagas
      const jobsResponse = await this.jobService.getVagas().toPromise();
      this.jobs = jobsResponse || [];

      // Buscar os IDs das candidaturas
      const applicationsResponse = await this.jobService
        .getApplicationsByUserId(this.targetId)
        .toPromise();
      this.filteredIds =
        applicationsResponse?.map((application) => application.vacancyId) || [];

      // Filtrar as vagas com base nos IDs
      this.filteredJobs = this.jobs.filter((job) =>
        this.filteredIds.includes(job.id)
      );
      this.canceledJobs = this.jobs.filter(
        (job) => job.isActive == false && job.isFilled == false
      );
      this.finishedJobs = this.filteredJobs.filter(
        (job) => job.isFilled == true || job.isActive == false
      );
      this.searchedJobs = this.filteredJobs
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      this.filteredJobs = []; // Inicializar como vazio em caso de erro
    }
  }

  onSearch(value: string) {
    const searchValue = this.removeAccents(value.toLowerCase());
    this.searchedJobs = this.filteredJobs.filter((job) =>
      this.removeAccents(job.title.toLowerCase()).includes(searchValue) // Compara sem acentos
    );
  }

  private removeAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove acentos
  }

  // Método chamado no ngOnInit
  ngOnInit(): void {
    this.fetchJobs();
  }

  // Filtra as vagas com base no applicationId e exibe as vagas associadas
  filterJobs(): void {
    // Aqui, já estamos passando tanto a vaga quanto o ID da candidatura
    this.filteredJobs = this.filteredJobs.filter(
      (item) => item.id !== undefined
    );
  }

  // async ngOnInit(): Promise<void> {
  //   this.canceledJobs = this.jobService.getCanceledJobs();
  //   await this.getJobs();
  //   await this.getJobsId();
  //   this.filterJobs();
  // }
}
