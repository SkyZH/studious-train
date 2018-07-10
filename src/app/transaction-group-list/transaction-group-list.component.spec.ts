import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionGroupListComponent } from './transaction-group-list.component';

describe('TransactionGroupListComponent', () => {
  let component: TransactionGroupListComponent;
  let fixture: ComponentFixture<TransactionGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
