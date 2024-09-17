import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCompanyComponent } from './article-company.component';

describe('ArticleCompanyComponent', () => {
  let component: ArticleCompanyComponent;
  let fixture: ComponentFixture<ArticleCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleCompanyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
