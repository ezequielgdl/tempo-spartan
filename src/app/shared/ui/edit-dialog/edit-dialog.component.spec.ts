import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { EditDialogComponent } from './edit-dialog.component';

describe('EditDialogComponent', () => {
  let component: EditDialogComponent;
  let fixture: ComponentFixture<EditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EditDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.buttonText).toBe('Edit Profile');
    expect(component.title).toBe('Edit profile');
    expect(component.description).toBe('Make changes to your profile here. Click save when you\'re done.');
    expect(component.saveButtonText).toBe('Save changes');
    expect(component.fields).toEqual([{id: 'name', label: 'Name', value: ''}]);
  });

  it('should create form controls based on input fields', () => {
    component.fields = [
      {id: 'name', label: 'Name', value: 'John Doe'},
      {id: 'email', label: 'Email', value: 'john@example.com'},
    ];
    component.ngOnInit();
    expect(component.form.get('name')).toBeTruthy();
    expect(component.form.get('email')).toBeTruthy();
    expect(component.form.get('name')?.value).toBe('John Doe');
    expect(component.form.get('email')?.value).toBe('john@example.com');
  });

  it('should emit save event with form values when onSave is called and form is valid', () => {
    spyOn(component.save, 'emit');
    component.fields = [
      {id: 'name', label: 'Name', value: 'John Doe'},
      {id: 'email', label: 'Email', value: 'john@example.com'},
    ];
    component.ngOnInit();
    component.onSave();
    expect(component.save.emit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
    });
  });

  it('should not emit save event when form is invalid', () => {
    spyOn(component.save, 'emit');
    component.fields = [
      {id: 'name', label: 'Name', value: '', validators: [Validators.required]},
    ];
    component.ngOnInit();
    component.onSave();
    expect(component.save.emit).not.toHaveBeenCalled();
  })
});
