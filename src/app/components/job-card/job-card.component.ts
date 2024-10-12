import { Component, Input, OnInit } from '@angular/core';
import { IJob } from '../../models/job.interface';
import { UserAuthService } from '../../services/auth/auth.service';
import { ICompany } from '../../models/company.interface';
import { IUser } from '../../models/user.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.css',
})
export class JobCardComponent implements OnInit {
  @Input() job!: IJob;

  companyName: string | undefined = this.authService.getCompanyData()?.name;

  userType: string | null = null;

  constructor(private authService: UserAuthService, private http: HttpClient) {}

  ngOnInit(): void {
    // Verifica o tipo de usuário ao inicializar o componente
    this.userType = this.authService.getUserType();
  }

  async apply() {
    console.log(this.job.id);
    this.checkCurriculum(this.authService.getUserData()?.id);
  }

  async checkCurriculum(id: number| undefined): Promise<boolean> {
    let exists = false;
    const apiUrl = `http://localhost:3333/users/${id}`;
    try {
      const response = await this.http.get<IUser>(apiUrl).toPromise();

      if (response && response.curriculumId != null) {
        exists = true;
      } else {
        exists = false;
      }
    } catch (error) {
      window.alert(`Erro ao fazer busca do currículo: ${error}`);
    }

    console.log(exists);
    return exists;
  }
}
