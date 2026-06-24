import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsFormationsComponent } from './sessions-formations.component';

describe('SessionsFormationsComponent', () => {
  let component: SessionsFormationsComponent;
  let fixture: ComponentFixture<SessionsFormationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionsFormationsComponent]
    });
    fixture = TestBed.createComponent(SessionsFormationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
