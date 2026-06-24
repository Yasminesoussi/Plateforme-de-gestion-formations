import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordApprenantComponent } from './change-password-apprenant.component';

describe('ChangePasswordApprenantComponent', () => {
  let component: ChangePasswordApprenantComponent;
  let fixture: ComponentFixture<ChangePasswordApprenantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePasswordApprenantComponent]
    });
    fixture = TestBed.createComponent(ChangePasswordApprenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
