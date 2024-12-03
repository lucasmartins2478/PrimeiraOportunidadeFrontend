import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {

  // Nesse componente eu defino variáveis que serão injetadas em outros componentes
  // e controlarão a mensagem e o estilo do alerta que será mostrado na tela

  @Input() title: string = '';
  @Input() message: string = '';
  @Input() class: string = '';
  @Input() isVisible: boolean = false;
  @Input() iconClass: string = '';
}
