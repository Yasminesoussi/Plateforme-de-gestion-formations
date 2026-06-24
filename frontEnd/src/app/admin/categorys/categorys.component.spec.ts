import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorysComponent } from './categorys.component';

describe('CategorysComponent', () => {
  let component: CategorysComponent;
  let fixture: ComponentFixture<CategorysComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategorysComponent]
    });
    fixture = TestBed.createComponent(CategorysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
