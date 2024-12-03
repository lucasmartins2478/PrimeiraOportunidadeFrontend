import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { JobService } from '../../services/job/job.service';
import { IJob } from '../../models/job.interface';
import { IApplication } from '../../models/application.interface'; // Adicione isso se você precisar de IApplication
import { companyFormService } from '../../services/company/company-form.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css',
})
export class ApplicationsComponent implements OnInit {
  jobs: IJob[] = [];
  filteredJobs: IJob[] = []; // Armazena objetos com job e applicationId
  filteredIds: number[] = [];
  canceledJobs: IJob[] = [];
  finishedJobs: IJob[] = [];
  searchedJobs: IJob[] = [];
  companyName: string[] = [];
  targetId = this.userService.getUserData()?.id;
  isLoading: boolean = true

  constructor(
    private userService: UserAuthService,
    private http: HttpClient,
    private jobService: JobService,
    private companyService: companyFormService
  ) {}


  async getCompanies() {
    this.companyService.getCompanies().subscribe(
      (response) => {
        response.forEach((company) => {
          this.companyName.push(company.name);
        });
      },
      (error) => {
        console.error(`Erro ao buscar empresas ${error}`);
      }
    );
  }

  // Método para buscar todas as vagas e filtrar as candidaturas
  async fetchJobs(): Promise<void> {
    this.isLoading = true; // Inicia o carregamento
    try {
      // Buscar todas as vagas
      const jobsResponse = await this.jobService.getVagas().toPromise();
      const jobs = jobsResponse || [];
      this.jobs = jobs;

      // Buscar todas as empresas
      const companiesResponse = await this.companyService.getCompanies().toPromise();
      const companies = companiesResponse || [];

      // Criar um mapa para facilitar a busca dos nomes das empresas
      const companyMap = new Map(companies.map((company) => [company.id, company.name]));

      // Adicionar os nomes das empresas às vagas
      const enrichedJobs = jobs.map((job) => ({
        ...job,
        companyName: companyMap.get(job.companyId) || 'Nome não encontrado',
      }));

      // Buscar os IDs das candidaturas do usuário
      const applicationsResponse = await this.jobService.getApplicationsByUserId(this.targetId).toPromise();
      const canceledApplications = await this.jobService.getCancelledApplications(this.targetId).toPromise();

      const filteredIds = applicationsResponse?.map((application) => application.vacancyId) || [];
      const canceledIds = canceledApplications?.map((application) => application.vacancyId) || [];

      // Verificar se há candidaturas canceladas
      if (canceledIds.length > 0) {
        // Adicionar as vagas canceladas ao array canceledJobs
        this.canceledJobs = enrichedJobs.filter((job) => canceledIds.includes(job.id));
      } else {
        // Nenhuma candidatura cancelada
        this.canceledJobs = [];
      }

      // Filtrar as vagas com base nos critérios
      this.filteredJobs = enrichedJobs.filter((job) => filteredIds.includes(job.id));
      this.finishedJobs = this.filteredJobs.filter((job) => job.isFilled || !job.isActive);

      // Inicializar as vagas buscadas
      this.searchedJobs = [...this.filteredJobs];
    } catch (error) {
      console.error('Erro ao buscar dados:', error);

      // Garantir que as propriedades estejam inicializadas mesmo em caso de erro
      this.jobs = [];
      this.filteredJobs = [];
      this.canceledJobs = [];
      this.finishedJobs = [];
      this.searchedJobs = [];
    } finally {
      this.isLoading = false; // Conclui o carregamento
    }
  }



  onSearch(value: string) {
    const searchValue = this.removeAccents(value.toLowerCase());
    this.searchedJobs = this.filteredJobs.filter(
      (job) => this.removeAccents(job.title.toLowerCase()).includes(searchValue) // Compara sem acentos
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
