import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job/job.service';
import { IJob } from '../../models/job.interface';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css'
})
export class JobsComponent implements OnInit {
  jobs: IJob[] = [];
  filteredJobs: IJob[] = [];

  constructor(private jobService: JobService) {}

  onSearch(value: string) {
    const searchValue = this.removeAccents(value.toLowerCase());
    this.filteredJobs = this.jobs.filter((job) =>
      this.removeAccents(job.title.toLowerCase()).includes(searchValue) // Compara sem acentos
    );
  }

  private removeAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove acentos
  }
  ngOnInit(): void {
    this.jobService.getVagas().subscribe(
      (data) => {
        this.jobs = data;
        this.filteredJobs = data
      },
      (error) => {
        console.error('Erro ao buscar as vagas:', error);
      }
    );

  }

}
