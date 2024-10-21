import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() class: string = '';
  @Input() isVisible: boolean = false;
  @Input() iconClass: string = '';
}
