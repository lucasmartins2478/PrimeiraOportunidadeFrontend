import { Component } from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.css'
})
export class ChatMessageComponent {
  messages: string[] = [];  // Definindo a propriedade 'messages'
  newMessage: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Inscreve-se no BehaviorSubject para receber as mensagens do serviço
    this.chatService.messages$.subscribe((messages) => {
      this.messages = messages;
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim() !== '') {
      // Envia a nova mensagem usando o serviço de chat
      this.chatService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }
}
