import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IJob } from '../../models/job.interface';
import { HttpClient } from '@angular/common/http';
import { IApplication } from '../../models/application.interface';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private apiUrl = 'https://backend-production-ff1f.up.railway.app/vacancies'; // Altere para a URL correta da sua API
  private canceledJobs: IJob[] = [];
  private storageKey = 'canceledJobs';

  constructor(private http: HttpClient) {}

  getVagas(): Observable<IJob[]> {
    return this.http.get<IJob[]>(this.apiUrl);
  }
  getJobById(id: string | null): Observable<IJob> {
    return this.http.get<IJob>(`${this.apiUrl}/${id}`);
  }
  getApplicationsByUserId(id: number | undefined): Observable<IApplication[]> {
    // Retorna os ids das vagas nas quais o usuário se cadastr
    return this.http.get<IApplication[]>(
      `https://backend-production-ff1f.up.railway.app/applications/${id}`
    );
  }
  getApplicationsByJobId(id: number): Observable<IApplication[]> {
    return this.http.get<IApplication[]>(
      `https://backend-production-ff1f.up.railway.app/applications/vacancy/${id}`
    );
  }

  addCanceledJob(job: IJob) {
    let canceledJobs = this.getCanceledJobs();
    canceledJobs.push(job);
    localStorage.setItem(this.storageKey, JSON.stringify(canceledJobs));
  }

  getCanceledJobs(): IJob[] {
    const jobs = localStorage.getItem(this.storageKey);
    return jobs ? JSON.parse(jobs) : [];
  }
  removeCanceledJob(jobId: number): void {
    // Obtemos as vagas canceladas do local storage
    let canceledJobs = this.getCanceledJobs();

    // Filtramos o array para remover a vaga com o ID especificado
    canceledJobs = canceledJobs.filter((job) => job.id !== jobId);

    // Atualizamos o local storage com a lista de vagas atualizada
    localStorage.setItem(this.storageKey, JSON.stringify(canceledJobs));
  }
}
