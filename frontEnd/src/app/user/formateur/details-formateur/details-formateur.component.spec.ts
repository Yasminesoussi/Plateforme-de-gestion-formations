import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFormateurComponent } from './details-formateur.component';

describe('DetailsFormateurComponent', () => {
  let component: DetailsFormateurComponent;
  let fixture: ComponentFixture<DetailsFormateurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsFormateurComponent]
    });
    fixture = TestBed.createComponent(DetailsFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
