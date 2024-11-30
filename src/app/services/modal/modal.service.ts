import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalOpen = new BehaviorSubject<boolean>(false);

  isModalOpen$ = this.modalOpen.asObservable();

  openModal() {
    this.modalOpen.next(true);
  }

  closeModal() {
    this.modalOpen.next(false);
  }
}
