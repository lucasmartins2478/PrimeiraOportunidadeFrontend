import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumForm2Component } from './curriculum-form-2.component';

describe('CurriculumForm2Component', () => {
  let component: CurriculumForm2Component;
  let fixture: ComponentFixture<CurriculumForm2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurriculumForm2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurriculumForm2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
