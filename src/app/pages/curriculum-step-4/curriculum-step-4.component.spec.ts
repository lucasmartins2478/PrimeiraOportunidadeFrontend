import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumStep4Component } from './curriculum-step-4.component';

describe('CurriculumStep4Component', () => {
  let component: CurriculumStep4Component;
  let fixture: ComponentFixture<CurriculumStep4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurriculumStep4Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurriculumStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
