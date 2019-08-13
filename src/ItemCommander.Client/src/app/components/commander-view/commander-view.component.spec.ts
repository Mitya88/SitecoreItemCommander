import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommanderViewComponent } from './commander-view.component';

describe('CommanderViewComponent', () => {
  let component: CommanderViewComponent;
  let fixture: ComponentFixture<CommanderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommanderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommanderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
