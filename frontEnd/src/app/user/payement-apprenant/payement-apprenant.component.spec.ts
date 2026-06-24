import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayementApprenantComponent } from './payement-apprenant.component';

describe('PayementApprenantComponent', () => {
  let component: PayementApprenantComponent;
  let fixture: ComponentFixture<PayementApprenantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayementApprenantComponent]
    });
    fixture = TestBed.createComponent(PayementApprenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
