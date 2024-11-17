import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IQuestion } from '../../models/job.interface';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  apiUrl = `https://backend-production-ff1f.up.railway.app/questions/vacancy`;
  constructor(private http: HttpClient) {}

  getQuestionsByJobId(id: string | null): Observable<IQuestion> {
    return this.http.get<IQuestion>(`${this.apiUrl}/${id}`);
  }
}
