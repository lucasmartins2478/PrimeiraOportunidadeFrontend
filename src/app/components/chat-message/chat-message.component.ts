import { Component, ElementRef, ViewChild,AfterViewChecked} from '@angular/core';
import { ChatService } from '../../services/chat/chat.service';
import { UserAuthService } from '../../services/auth/auth.service';
import { IMessage } from '../../models/message.interface';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css'],
})
export class ChatMessageComponent implements AfterViewChecked {
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
    this.chatService.listenMessages();

    this.chatService.getMessages().subscribe(
      (messages) => {
        this.messages = messages;
      },
      (error) => {
        console.error('Erro ao buscar mensagens:', error);
      }
    );
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (this.newMessage.trim() !== '') {
      this.chatService.sendMessage(this.newMessage).subscribe((message) => {
        // Se o servidor retornar a mensagem enviada, adicione-a manualmente à lista de mensagens
        this.messages.push(message);
        this.newMessage = '';
        this.scrollToBottom();
      });
    }
  }

  private scrollToBottom(): void {
    try {
      this.chatWindow.nativeElement.scrollTop =
        this.chatWindow.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Erro ao rolar para a última mensagem:', err);
    }
  }
}
