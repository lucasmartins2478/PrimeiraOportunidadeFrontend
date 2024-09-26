import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumStep3Component } from './curriculum-step-3.component';

describe('CurriculumStep3Component', () => {
  let component: CurriculumStep3Component;
  let fixture: ComponentFixture<CurriculumStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurriculumStep3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurriculumStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
