import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDateListComponent } from './transaction-date-list.component';

describe('TransactionDateListComponent', () => {
  let component: TransactionDateListComponent;
  let fixture: ComponentFixture<TransactionDateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionDateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
