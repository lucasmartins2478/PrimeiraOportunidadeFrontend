import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IMessage } from '../../models/message.interface';
import { UserAuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  apiUrl: string = 'http://localhost:3333/messages';
  private messagesSource = new BehaviorSubject<IMessage[]>([]);
  public messages$ = this.messagesSource.asObservable();

  constructor(private http: HttpClient, private authService: UserAuthService) {
    // Inicia o polling para buscar novas mensagens
    this.startPolling();
  }

  getMessages(): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(this.apiUrl);
  }

  private startPolling(): void {
    // Polling para buscar mensagens a cada 3 segundos
    setInterval(() => {
      this.getMessages().subscribe(
        (messages: IMessage[]) => {
          this.messagesSource.next(messages);
        },
        (error) => console.error('Erro ao buscar mensagens:', error)
      );
    }, 3000); // Intervalo de 3 segundos (ajuste conforme necessário)
  }

  // Atualiza o método para retornar um Observable da resposta
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

    // Retorna o Observable para o componente gerenciar a atualização
    return this.http.post(apiUrl, body);
  }
}
