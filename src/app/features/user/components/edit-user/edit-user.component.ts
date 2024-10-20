import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditDialogComponent } from '../../../../shared/ui/edit-dialog/edit-dialog.component';
import { UserService } from '../../services/user.service';
import { UserInfo } from '../../interface';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, EditDialogComponent],
  template: `
    <app-edit-dialog
      [buttonText]="'Edit Profile'"
      [title]="'Edit profile'"
      [description]="'Make changes to your profile here. Click save when youre done.'"
      [fields]="fields"
      [saveButtonText]="'Save changes'"
      (save)="onSave($event)"
    ></app-edit-dialog>
  `,
  styles: ``
})
export class EditUserComponent implements OnInit {

  constructor(private userService: UserService) {}

  @Input() user!: UserInfo;
  fields: Array<{id: string, label: string, value: string}> = [];

  ngOnInit() {
    this.initializeFields();
  }

  initializeFields() {
    if (this.user) {
      this.fields = [
        {id: 'name', label: 'Name', value: this.user.name},
        {id: 'nif', label: 'NIF', value: this.user.nif},
        {id: 'address', label: 'Address', value: this.user.address},
        {id: 'phone', label: 'Phone', value: this.user.phone},
        {id: 'website', label: 'Website', value: this.user.website},
        {id: 'iban', label: 'IBAN', value: this.user.iban},
      ];
    }
  }

  onSave(data: {[key: string]: string}) {
    this.userService.updateUser(this.user.id, data).subscribe((user) => {
      this.user = user!;
    });
  }
}
