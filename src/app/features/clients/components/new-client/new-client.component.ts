import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { EditDialogComponent } from '../../../../shared/ui/edit-dialog/edit-dialog.component';
import { ClientService } from '../../services/clients.service';
import { Validators, ValidatorFn } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-new-client',
  standalone: true,
  imports: [EditDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-edit-dialog 
      buttonText="New Client"
      title="Add Client"
      description="Add a new client here."
      [fields]="fields"
      saveButtonText="Add Client"
      (save)="onSave($event)"
    />
  `
})
export class NewClientComponent implements OnDestroy {
  fields: Array<{id: string, label: string, value: string | number, validators?: ValidatorFn | ValidatorFn[]}> = [];
  private destroy$ = new Subject<void>();

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.initializeFields();
  }

  initializeFields() {
    this.fields = [
      { id: 'name', label: 'Name', value: '', validators: [Validators.required] },
      { id: 'address', label: 'Address', value: '', validators: [Validators.required] },
      { id: 'email', label: 'Email', value: ''},
      { id: 'phone', label: 'Phone', value: '' },
      { id: 'CIF', label: 'CIF', value: '' },
      { id: 'pricePerHour', label: 'Price Per Hour', value: 0 },
    ];
  }

  onSave(event: any) {
    this.clientService.createClient(event)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.initializeFields();
      }); 
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
