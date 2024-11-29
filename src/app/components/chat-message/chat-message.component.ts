import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
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
  isLoading: boolean = true;

  @ViewChild('chatWindow') private chatWindow!: ElementRef;

  constructor(
    private chatService: ChatService,
    private authService: UserAuthService
  ) {}
  private async loadData(): Promise<void> {
    this.isLoading = true; // Define como true no início
    try {
      await this.getMessages()
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
    } finally {
      this.isLoading = false; // Conclui o carregamento
    }
  }
  async getMessages(): Promise<void> {
    this.userId = this.authService.getUserData()?.id
    return new Promise<void>((resolve, reject) => {
      this.chatService.getMessages().subscribe(
        (messages) => {
          this.messages = messages;
          resolve();
        },
        (error) => {

          reject(error);
        }
      );
    });
  }

  ngOnInit(): void {
    this.loadData()
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
      
    }
  }
}
