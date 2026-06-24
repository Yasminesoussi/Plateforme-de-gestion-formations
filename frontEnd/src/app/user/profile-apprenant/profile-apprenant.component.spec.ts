import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileApprenantComponent } from './profile-apprenant.component';

describe('ProfileApprenantComponent', () => {
  let component: ProfileApprenantComponent;
  let fixture: ComponentFixture<ProfileApprenantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileApprenantComponent]
    });
    fixture = TestBed.createComponent(ProfileApprenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
