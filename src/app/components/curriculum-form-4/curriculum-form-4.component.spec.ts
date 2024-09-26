import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumForm4Component } from './curriculum-form-4.component';

describe('CurriculumForm4Component', () => {
  let component: CurriculumForm4Component;
  let fixture: ComponentFixture<CurriculumForm4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurriculumForm4Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurriculumForm4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
