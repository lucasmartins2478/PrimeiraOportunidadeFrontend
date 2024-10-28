import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { UserAuthService } from '../../services/auth/auth.service';
import { IMessage } from '../../models/message.interface';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css'],
})
export class ChatMessageComponent implements OnInit, AfterViewInit {
  messages: IMessage[] = [];
  newMessage: string = '';
  userId: number | undefined;

  @ViewChild('chatWindow') private chatWindow!: ElementRef;

  constructor(
    private chatService: ChatService,
    private authService: UserAuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserData()?.id;

    // Carrega as mensagens e faz scroll para o final ao carregar
    this.chatService.getMessages().subscribe(
      (messages) => {
        this.messages = messages;
        this.scrollToBottom();
      },
      (error) => {
        console.error('Erro ao buscar mensagens:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (this.newMessage.trim() !== '') {
      const messageContent = this.newMessage; // Salve o conteúdo da mensagem antes de resetar

      // Envia a nova mensagem usando o serviço de chat
      this.chatService.sendMessage(messageContent).subscribe(() => {
        // Após enviar, chama getMessages para atualizar as mensagens
        this.chatService.getMessages().subscribe((messages) => {
          this.messages = messages;
          this.scrollToBottom(); // Rola para a última mensagem
        });
      });

      // Limpa o campo de mensagem
      this.newMessage = '';
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatWindow) {
        this.chatWindow.nativeElement.scrollTop =
          this.chatWindow.nativeElement.scrollHeight;
      }
    }, 0);
  }
}
