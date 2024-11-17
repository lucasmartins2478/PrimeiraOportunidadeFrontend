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
  targetId = this.authService.getCompanyData()?.id; // Substitua pelo ID desejado

  constructor(
    private jobService: JobService,
    private authService: UserAuthService
  ) {}

  ngOnInit(): void {
    this.jobService.getVagas().subscribe(
      (data) => {
        this.jobs = data;
        // Filtra as vagas com o id especificado
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
      },
      (error) => {
        console.error('Erro ao buscar as vagas:', error);
      }
    );
  }
}
