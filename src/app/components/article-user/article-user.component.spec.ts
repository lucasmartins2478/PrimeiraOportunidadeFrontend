import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleUserComponent } from './article-user.component';

describe('ArticleUserComponent', () => {
  let component: ArticleUserComponent;
  let fixture: ComponentFixture<ArticleUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
