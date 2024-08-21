import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalHistoryComponent } from './global-history.component';

describe('GlobalHistoryComponent', () => {
  let component: GlobalHistoryComponent;
  let fixture: ComponentFixture<GlobalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
