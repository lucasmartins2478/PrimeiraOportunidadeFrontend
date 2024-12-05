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
  // Esse componente controla as mensagens que serão visualizadas na tela
  // e também as mensagens que o próprio usuário logado pode mandar
  messages: IMessage[] = [];
  newMessage: string = '';
  userId: number | undefined;
  isLoading: boolean = true;

  @ViewChild('chatWindow') private chatWindow!: ElementRef;

  constructor(
    private chatService: ChatService,
    private authService: UserAuthService
  ) {}

  // Função que gerencia a exibição do loading na tela enquanto as mensagens
  // são carregadas do nosso banco de dados usando o service

  private async loadData(): Promise<void> {
    this.isLoading = true; // Define como true no início
    try {
      this.userId = this.authService.getUserData()?.id
      await this.getMessages();
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
    } finally {
      this.isLoading = false; // Conclui o carregamento
    }
  }

  // Função responsável por pegar todas as mensagens
  // armazenadas no banco de dados utilizando o chatService

  async getMessages(): Promise<void> {
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

  // Inicia o componente já chamando a função de load que chama as outras funções
  // após os dados serem buscados do banco de dados

  ngOnInit(): void {
    this.loadData();
  }

  // Função que faz a chamada da função que atualiza a exibição sempre
  // Para a ultima mensagem enviada

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  // Função que envia uma nova mensagem para o banco de dados,
  // adiciona também no array de mensagens para exibir na tela

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

  // Função que faz com que após uma mensagem ser enviada, a tela desça
  // para a nova menasagem automaticamente

  private scrollToBottom(): void {
    try {
      this.chatWindow.nativeElement.scrollTop =
        this.chatWindow.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
