import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job/job.service';
import { IJob } from '../../models/job.interface';
import { companyFormService } from '../../services/company/company-form.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css',
})
export class JobsComponent implements OnInit {
  jobs: IJob[] = [];
  filteredJobs: IJob[] = [];
  isLoading: boolean = true;

  constructor(
    private jobService: JobService,
    private companyService: companyFormService
  ) {}
  private async loadData(): Promise<void> {
    this.isLoading = true; // Define como true no início
    try {
      await this.fetchJobs();
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
    } finally {
      this.isLoading = false; // Conclui o carregamento
    }
  }

  onSearch(value: string) {
    const searchValue = this.removeAccents(value.toLowerCase());
    this.filteredJobs = this.jobs.filter((job) => {
      const titleMatch = this.removeAccents(job.title.toLowerCase()).includes(
        searchValue
      );
      const descriptionMatch = this.removeAccents(
        job.modality.toLowerCase()
      ).includes(searchValue);
      const locationMatch = this.removeAccents(
        job.locality.toLowerCase()
      ).includes(searchValue);
      const companyNameMatch = this.removeAccents(
        job.companyName.toLowerCase()
      ).includes(searchValue);
      const jobLevelMatch = this.removeAccents(
        job.level.toLowerCase()
      ).includes(searchValue);
      // Retorna true se qualquer condição for atendida
      return (
        titleMatch ||
        descriptionMatch ||
        locationMatch ||
        companyNameMatch ||
        jobLevelMatch
      );
    });
  }
  getJobsByLevel(level: string): any[] {
    return this.filteredJobs.filter((job) => job.level === level);
  }

  private removeAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove acentos
  }

  async fetchJobs(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.companyService.getCompanies().subscribe(
        (companies) => {
          // Criar um dicionário com id da empresa como chave
          const companyMap = new Map<number, string>();
          companies.forEach((company) => {
            companyMap.set(company.id, company.name);
          });

          // Agora buscar as vagas
          this.jobService.getVagas().subscribe(
            (jobs) => {
              // Filtrar vagas ativas e não preenchidas
              const validJobs = jobs.filter(
                (job) => job.isActive && !job.isFilled
              );

              // Adicionar o nome da empresa em cada vaga
              this.jobs = validJobs.map((job) => ({
                ...job,
                companyName:
                  companyMap.get(job.companyId) || 'Empresa não encontrada',
              }));

              // Inicializar filteredJobs com as vagas modificadas
              this.filteredJobs = this.jobs;
              resolve();
            },
            (error) => {
              console.error('Erro ao buscar as vagas:', error);
              reject(error);
            }
          );
        },
        (error) => {
          console.error(`Erro ao buscar empresas: ${error}`);
          reject(error);
        }
      );
    });
  }

  ngOnInit(): void {
    // Primeiro, buscar as empresas
    this.loadData();
  }
}
