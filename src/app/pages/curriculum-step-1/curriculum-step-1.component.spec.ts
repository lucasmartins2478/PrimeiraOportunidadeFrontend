import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumStep1Component } from './curriculum-step-1.component';

describe('CurriculumStep1Component', () => {
  let component: CurriculumStep1Component;
  let fixture: ComponentFixture<CurriculumStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurriculumStep1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurriculumStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
