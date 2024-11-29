// chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IMessage } from '../../models/message.interface';
import { UserAuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  apiUrl: string = 'https://backend-production-ff1f.up.railway.app/messages';
  private messagesSource = new BehaviorSubject<IMessage[]>([]);
  public messages$ = this.messagesSource.asObservable();

  constructor(private http: HttpClient, private authService: UserAuthService) {}

  getMessages(): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(this.apiUrl);
  }

  sendMessage(message: string): Observable<any> {
    const apiUrl = 'https://backend-production-ff1f.up.railway.app/message';
    const sender_id = this.authService.getUserData()?.id;
    const sender_name = this.authService.getUserData()?.name;
    const content = message;

    const body = {
      sender_id: sender_id,
      content: content,
      sender_name: sender_name,
    };

    return this.http.post(apiUrl, body);
  }

}
