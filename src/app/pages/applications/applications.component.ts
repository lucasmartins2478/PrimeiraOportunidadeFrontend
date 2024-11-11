import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { JobService } from '../../services/job/job.service';
import { IJob } from '../../models/job.interface';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css',
})
export class ApplicationsComponent implements OnInit {
  jobs: IJob[] = [];
  filteredJobs: IJob[] = [];
  filteredIds: number[] = [];
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
      const response = await this.jobService.getJobsByApplicationId(this.targetId).toPromise();
      if (response) {
        this.filteredIds = response.map(application => application.vacancyId);
      } else {
        this.filteredIds = []; // Garante que filteredIds seja um array válido
      }
    } catch (error) {
      console.error(`Erro ao buscar candidaturas: ${error}`);
      this.filteredIds = []; // Em caso de erro, inicializa como array vazio
    }
  }



  filterJobs(): void {
    this.filteredJobs = this.jobs.filter(job => this.filteredIds.includes(job.id!));

  }


  async ngOnInit(): Promise<void> {
    await this.getJobs();
    await this.getJobsId();
    this.filterJobs();
  }
}
