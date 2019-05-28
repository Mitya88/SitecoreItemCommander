import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastViewPageComponent } from './fast-view-page.component';

describe('FastViewPageComponent', () => {
  let component: FastViewPageComponent;
  let fixture: ComponentFixture<FastViewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastViewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
