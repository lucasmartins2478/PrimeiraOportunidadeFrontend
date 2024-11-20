import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAnswer, IQuestion } from '../../models/job.interface';

@Injectable({
  providedIn: 'root'
})
export class AnswersService {

  apiUrl = "https://backend-production-ff1f.up.railway.app/answers"
  constructor(private http : HttpClient) { }

  getAnswerOfQuestion(questionId: number, userId: number): Observable<IAnswer | null> {
    return new Observable((observer) => {
      this.http.get<IAnswer[]>(`${this.apiUrl}/question/${questionId}`).subscribe(
        (answers) => {
          if (Array.isArray(answers)) {
            // Encontra a resposta do usuário
            const answer = answers.find((a) => a.userId === userId) || null;
            observer.next(answer); // Emite o valor encontrado ou null
          } else {
            console.error('A resposta da API não é uma lista de respostas');
            observer.next(null); // Emite null se o formato for inesperado
          }
          observer.complete(); // Finaliza o Observable
        },
        (error) => {
          console.error(`Erro ao buscar respostas da pergunta ${questionId}: ${error}`);
          observer.error(error); // Propaga o erro
        }
      );
    });
  }


}
