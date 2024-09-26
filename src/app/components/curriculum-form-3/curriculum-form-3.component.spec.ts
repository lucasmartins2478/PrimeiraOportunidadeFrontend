import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumForm3Component } from './curriculum-form-3.component';

describe('CurriculumForm3Component', () => {
  let component: CurriculumForm3Component;
  let fixture: ComponentFixture<CurriculumForm3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurriculumForm3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurriculumForm3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
