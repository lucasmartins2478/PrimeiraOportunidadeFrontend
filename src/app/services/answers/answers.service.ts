import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, concatWith, Observable, throwError } from 'rxjs';
import { IAnswer, IQuestion } from '../../models/job.interface';

@Injectable({
  providedIn: 'root'
})
export class AnswersService {

  apiUrl = "https://backend-production-ff1f.up.railway.app/answers"
  constructor(private http : HttpClient) { }

  getAnswerOfQuestion(questionId: number): Observable<IAnswer[]> {
    return this.http.get<IAnswer[]>(`${this.apiUrl}/question/${questionId}`).pipe(
      catchError((error: any)=>{
        console.error(`Erro ao buscar respostas ${error}`)
        return throwError(error)
      })
    )
  }


}
