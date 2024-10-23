import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // O array de mensagens será gerenciado por um BehaviorSubject para facilitar a atualização em tempo real
  private messagesSource = new BehaviorSubject<string[]>([]);
  public messages$ = this.messagesSource.asObservable();

  constructor() {}

  // Função para enviar uma nova mensagem
  sendMessage(message: string): void {
    const currentMessages = this.messagesSource.value;
    // Adiciona a nova mensagem ao array
    const updatedMessages = [...currentMessages, message];
    // Atualiza o BehaviorSubject com a nova lista de mensagens
    this.messagesSource.next(updatedMessages);
  }
}
