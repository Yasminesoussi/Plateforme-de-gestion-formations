import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpFormateurComponent } from './sign-up-formateur.component';

describe('SignUpFormateurComponent', () => {
  let component: SignUpFormateurComponent;
  let fixture: ComponentFixture<SignUpFormateurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpFormateurComponent]
    });
    fixture = TestBed.createComponent(SignUpFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
