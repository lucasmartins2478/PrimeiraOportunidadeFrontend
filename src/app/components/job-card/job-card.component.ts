import { Component, Input, OnInit } from '@angular/core';
import { IJob } from '../../models/job.interface';
import { UserAuthService } from '../../services/auth/auth.service';
import { ICompany } from '../../models/company.interface';
import { IUser } from '../../models/user.interface';
import { HttpClient } from '@angular/common/http';
import { ICurriculum } from '../../models/curriculum.interface';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.css',
})
export class JobCardComponent implements OnInit {
  @Input() job!: IJob;

  userData = this.authService.getUserData();

  companyName: string | undefined = this.authService.getCompanyData()?.name;

  userType: string | null = null;

  constructor(private authService: UserAuthService, private http: HttpClient) {}

  ngOnInit(): void {
    // Verifica o tipo de usuário ao inicializar o componente
    this.userType = this.authService.getUserType();
  }

  async apply() {
    const exist = await this.checkCurriculum(this.authService.getUserData()?.id);

    if(exist){

    }else{
  
    }
  }

  async checkCurriculum(id: number| undefined): Promise<boolean> {
    let exists = false;
    const apiUrl = `http://localhost:3333/curriculum/${id}`;
    try {
      const response = await this.http.get<ICurriculum>(apiUrl).toPromise();

      if (response && response.description != null) {
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
