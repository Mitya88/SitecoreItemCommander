import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilistComponent } from './multilist.component';

describe('MultilistComponent', () => {
  let component: MultilistComponent;
  let fixture: ComponentFixture<MultilistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultilistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultilistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
