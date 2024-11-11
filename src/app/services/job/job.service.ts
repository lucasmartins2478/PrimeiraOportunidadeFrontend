import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IJob } from '../../models/job.interface'
import { HttpClient } from '@angular/common/http';
import { IApplication } from '../../models/application.interface';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'http://localhost:3333/vacancies'; // Altere para a URL correta da sua API

  constructor(private http: HttpClient) {}

  getVagas(): Observable<IJob[]> {
    return this.http.get<IJob[]>(this.apiUrl);
  }
  getJobById(id: string | null): Observable<IJob>{
    return this.http.get<IJob>(`${this.apiUrl}/${id}`)
  }
  getJobsByApplicationId(id: number | undefined): Observable<IApplication[]>{
    // Retorna os ids das vagas nas quais o usuário se cadastr
    return this.http.get<IApplication[]>(`http://localhost:3333/applications/${id}`)

  }
}
