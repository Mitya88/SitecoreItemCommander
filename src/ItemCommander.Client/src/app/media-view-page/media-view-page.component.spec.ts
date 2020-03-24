import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaViewPageComponent } from './media-view-page.component';

describe('MediaViewPageComponent', () => {
  let component: MediaViewPageComponent;
  let fixture: ComponentFixture<MediaViewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaViewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
