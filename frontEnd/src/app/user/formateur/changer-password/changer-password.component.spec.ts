import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangerPasswordComponent } from './changer-password.component';

describe('ChangerPasswordComponent', () => {
  let component: ChangerPasswordComponent;
  let fixture: ComponentFixture<ChangerPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangerPasswordComponent]
    });
    fixture = TestBed.createComponent(ChangerPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
