import { Component, Input, OnInit } from '@angular/core';
import { IJob } from '../../models/job.interface';
import { UserAuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.css'
})
export class JobCardComponent implements OnInit{
  @Input() job!: IJob;

  userType: string | null = null;

  constructor(private authService: UserAuthService){}

  ngOnInit(): void {
    // Verifica o tipo de usuário ao inicializar o componente
    this.userType = this.authService.getUserType();
  }
}
