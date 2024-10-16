import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IJob } from '../../models/job.interface'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'http://localhost:3333/vacancies'; // Altere para a URL correta da sua API

  constructor(private http: HttpClient) {}

  getVagas(): Observable<IJob[]> {
    return this.http.get<IJob[]>(this.apiUrl);
  }
}
