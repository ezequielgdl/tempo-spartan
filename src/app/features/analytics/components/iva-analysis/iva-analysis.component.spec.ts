import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IvaAnalysisComponent } from './iva-analysis.component';

describe('IvaAnalysisComponent', () => {
  let component: IvaAnalysisComponent;
  let fixture: ComponentFixture<IvaAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IvaAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IvaAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
