import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumRegisterComponent } from './curriculum-register.component';

describe('CurriculumRegisterComponent', () => {
  let component: CurriculumRegisterComponent;
  let fixture: ComponentFixture<CurriculumRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurriculumRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurriculumRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
