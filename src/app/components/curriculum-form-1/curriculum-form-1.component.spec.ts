import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumForm1Component } from './curriculum-form-1.component';

describe('CurriculumForm1Component', () => {
  let component: CurriculumForm1Component;
  let fixture: ComponentFixture<CurriculumForm1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurriculumForm1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurriculumForm1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
