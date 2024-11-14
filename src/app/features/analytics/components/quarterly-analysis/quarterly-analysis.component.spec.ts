import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuarterlyAnalysisComponent } from './quarterly-analysis.component';

describe('QuarterlyAnalysisComponent', () => {
  let component: QuarterlyAnalysisComponent;
  let fixture: ComponentFixture<QuarterlyAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuarterlyAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuarterlyAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
