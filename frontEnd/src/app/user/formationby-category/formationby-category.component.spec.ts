import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationbyCategoryComponent } from './formationby-category.component';

describe('FormationbyCategoryComponent', () => {
  let component: FormationbyCategoryComponent;
  let fixture: ComponentFixture<FormationbyCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormationbyCategoryComponent]
    });
    fixture = TestBed.createComponent(FormationbyCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
