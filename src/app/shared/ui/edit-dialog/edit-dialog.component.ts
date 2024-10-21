import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnDialogContentDirective, BrnDialogCloseDirective, BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
    BrnDialogCloseDirective,

    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,

    HlmLabelDirective,
    HlmInputDirective,
    HlmButtonDirective,
  ],
  template: `
    <hlm-dialog>
      <button id="edit-profile" brnDialogTrigger hlmBtn>{{ buttonText }}</button>
      <hlm-dialog-content class="sm:max-w-[425px]" *brnDialogContent="let ctx">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>{{ title }}</h3>
          <p hlmDialogDescription>{{ description }}</p>
        </hlm-dialog-header>
        <form [formGroup]="form" (ngSubmit)="onSave()">
          <div class="py-4 grid gap-4">
            @for (field of fields; track field.id) {
              <div class="items-center grid grid-cols-4 gap-4">
                <label hlmLabel [for]="field.id" class="text-right">{{ field.label }}</label>
                <input hlmInput [id]="field.id" [formControlName]="field.id" class="col-span-3" />
              </div>
            }
          </div>
          <hlm-dialog-footer>
            <button hlmBtn type="submit" brnDialogClose [disabled]="form.invalid">{{ saveButtonText }}</button>
          </hlm-dialog-footer>
        </form>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class EditDialogComponent implements OnInit {
  @Input() buttonText: string = 'Edit Profile';
  @Input() title: string = 'Edit profile';
  @Input() description: string = 'Make changes to your profile here. Click save when you\'re done.';
  @Input() fields: Array<{
    id: string, 
    label: string, 
    value: string | number,
    validators?: ValidatorFn | ValidatorFn[]
  }> = [{id: 'name', label: 'Name', value: ''}];
  @Input() saveButtonText: string = 'Save changes';
  @Output() save = new EventEmitter<{[key: string]: string | number}>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const formControls: {[key: string]: any} = {};
    this.fields.forEach(field => {
      formControls[field.id] = [field.value, field.validators];
    });
    this.form = this.fb.group(formControls);
  }

  onSave() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
}
