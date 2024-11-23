import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css'
})
export class SearchFormComponent {
  @Output() searchEvent = new EventEmitter<string>();

  onSearch(value: string) {
    this.searchEvent.emit(value); // Emite o valor da pesquisa para o componente pai
  }

}
