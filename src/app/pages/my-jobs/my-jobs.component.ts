import { Component, OnInit } from '@angular/core';
import { IJob } from '../../models/job.interface';
import { JobService } from '../../services/job/job.service';
import { UserAuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-my-jobs',
  templateUrl: './my-jobs.component.html',
  styleUrl: './my-jobs.component.css',
})
export class MyJobsComponent implements OnInit {
  jobs: IJob[] = []; // Todas as vagas
  filteredJobs: IJob[] = []; // Vagas filtradas
  canceledJobs: IJob[] = [];
  finishedJobs: IJob[] = [];
  searchedJobs: IJob[] = [];
  companyData = this.authService.getCompanyData();
  targetId = this.authService.getCompanyData()?.id; // Substitua pelo ID desejado
  isLoading: boolean = true

  constructor(
    private jobService: JobService,
    private authService: UserAuthService
  ) {}
  onSearch(value: string) {
    const searchValue = this.removeAccents(value.toLowerCase());
    this.searchedJobs = this.filteredJobs.filter(
      (job) => this.removeAccents(job.title.toLowerCase()).includes(searchValue) // Compara sem acentos
    );
  }
  private async loadData(): Promise<void> {
    this.isLoading = true; // Define como true no início
    try {
      await this.getJobs()
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
    } finally {
      this.isLoading = false; // Conclui o carregamento
    }
  }

  private removeAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove acentos
  }
  async getJobs(): Promise<void>{
    const companyName = this.companyData?.name ?? '';
    return new Promise<void>((resolve, reject)=>{
      this.jobService.getVagas().subscribe(
        (data) => {
          // Adicionar o nome da empresa às vagas
          this.jobs = data.map((job) => ({
            ...job,
            companyName: companyName, // Nome da empresa com valor garantido
          }));

          // Filtrar as vagas com base nos critérios
          this.canceledJobs = this.jobs.filter(
            (job) => job.companyId === this.targetId && job.isActive == false
          );
          this.finishedJobs = this.jobs.filter(
            (job) =>
              job.companyId === this.targetId &&
              job.isFilled == true &&
              job.isActive == true
          );
          this.filteredJobs = this.jobs.filter(
            (job) =>
              job.companyId === this.targetId &&
              job.isActive == true &&
              job.isFilled == false
          );
          this.searchedJobs = this.filteredJobs;
          resolve()
        },
        (error) => {
          console.error('Erro ao buscar as vagas:', error);
          reject(error)
        }
      );
    })
  }

  ngOnInit(): void {
    // Obter o nome da empresa armazenado em companyData, garantindo um valor padrão


    // Buscar as vagas associadas

  }
}
