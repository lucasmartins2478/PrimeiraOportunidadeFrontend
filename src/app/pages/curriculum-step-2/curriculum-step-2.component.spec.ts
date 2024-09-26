import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumStep2Component } from './curriculum-step-2.component';

describe('CurriculumStep2Component', () => {
  let component: CurriculumStep2Component;
  let fixture: ComponentFixture<CurriculumStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurriculumStep2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurriculumStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
