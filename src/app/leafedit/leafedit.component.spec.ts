import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeafeditComponent } from './leafedit.component';

describe('LeafeditComponent', () => {
  let component: LeafeditComponent;
  let fixture: ComponentFixture<LeafeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeafeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeafeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
