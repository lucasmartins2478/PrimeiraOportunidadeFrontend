import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-card',
  templateUrl: './section-card.component.html',
  styleUrl: './section-card.component.css'
})
export class SectionCardComponent {

  @Input() link: string = ''
  @Input() title:string = ''

}
