import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditDialogComponent } from '../../../../shared/ui/edit-dialog/edit-dialog.component';
import { UserService } from '../../services/user.service';
import { UserInfo } from '../../interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, EditDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-edit-dialog
      [buttonText]="'Edit Profile'"
      [title]="'Edit profile'"
      [description]="
        'Make changes to your profile here. Click save when youre done.'
      "
      [fields]="fields"
      [saveButtonText]="'Save changes'"
      (save)="onSave($event)"
    ></app-edit-dialog>
  `,
  styles: ``,
})
export class EditUserComponent implements OnChanges, OnDestroy {
  constructor(private userService: UserService) {}
  private destroy$ = new Subject<void>();

  @Input() user!: UserInfo;
  fields: Array<{ id: string; label: string; value: string | number }> = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && changes['user'].currentValue) {
      this.initializeFields();
    }
  }

  initializeFields() {
    if (this.user) {
      this.fields = [
        { id: 'name', label: 'Name', value: this.user.name || '' },
        { id: 'nif', label: 'NIF', value: this.user.nif || '' },
        { id: 'address', label: 'Address', value: this.user.address || '' },
        { id: 'phone', label: 'Phone', value: this.user.phone || '' },
        { id: 'website', label: 'Website', value: this.user.website || '' },
        { id: 'iban', label: 'IBAN', value: this.user.iban || '' },
      ];
    }
  }

  onSave(data: { [key: string]: string | number }) {
    this.userService
      .updateOrCreateUser(this.user.id, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
