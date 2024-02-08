import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
})
export class ConfirmationDialogComponent {
  constructor(public activeModal: NgbActiveModal) {}

  confirm(): void {
    this.activeModal.close(true);
  }

  dismiss(): void {
    this.activeModal.dismiss(false);
  }
}
