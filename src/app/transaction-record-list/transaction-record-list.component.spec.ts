import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionRecordListComponent } from './transaction-record-list.component';

describe('TransactionRecordListComponent', () => {
  let component: TransactionRecordListComponent;
  let fixture: ComponentFixture<TransactionRecordListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionRecordListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionRecordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
