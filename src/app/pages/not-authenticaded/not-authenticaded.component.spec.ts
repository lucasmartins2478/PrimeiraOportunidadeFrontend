import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAuthenticadedComponent } from './not-authenticaded.component';

describe('NotAuthenticadedComponent', () => {
  let component: NotAuthenticadedComponent;
  let fixture: ComponentFixture<NotAuthenticadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotAuthenticadedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotAuthenticadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
