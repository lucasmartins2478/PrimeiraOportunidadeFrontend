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

  constructor(
    private userService: UserAuthService,
    private http: HttpClient,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.jobService.getVagas().subscribe(
      (data) => {
        this.jobs = data;
      },
      (error) => {
        console.error('Erro ao buscar as vagas:', error);
      }
    );
  }
}
