import { Component } from '@angular/core';
import { LoadingService } from './services/loading/loading.service';
import { ModalService } from './services/modal/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'PrimeiraOportunidade';
  loading$ = this.loadingService.loading$;
  isModalOpen = false;

  constructor(
    private loadingService: LoadingService,
    private modalService: ModalService
  ) {
    this.modalService.isModalOpen$.subscribe((status) => {
      this.isModalOpen = status;
    });
  }
}
