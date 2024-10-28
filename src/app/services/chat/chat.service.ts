import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IMessage } from '../../models/message.interface';
import { UserAuthService } from '../auth/auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  apiUrl: string = 'http://localhost:3333/messages';
  private messagesSource = new BehaviorSubject<IMessage[]>([]);
  public messages$ = this.messagesSource.asObservable();

  constructor(private http: HttpClient, private authService: UserAuthService) {
    this.startPolling();
  }

  getMessages(): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(this.apiUrl);
  }

  private startPolling(): void {
    setInterval(() => {
      this.getMessages().subscribe(
        (messages: IMessage[]) => {
          this.messagesSource.next(messages);
        },
        (error) => console.error('Erro ao buscar mensagens:', error)
      );
    }, 1000);
  }

  sendMessage(message: string): Observable<any> {
    const apiUrl = 'http://localhost:3333/message';
    const sender_id = this.authService.getUserData()?.id;
    const sender_name = this.authService.getUserData()?.name;
    const content = message;

    const body = {
      sender_id: sender_id,
      content: content,
      sender_name: sender_name
    };

    return this.http.post<IMessage>(apiUrl, body).pipe(
      tap((newMessage) => {
        // Adiciona a nova mensagem diretamente ao array de mensagens
        const updatedMessages = [...this.messagesSource.value, newMessage];
        this.messagesSource.next(updatedMessages);
      })
    );
  }
}
