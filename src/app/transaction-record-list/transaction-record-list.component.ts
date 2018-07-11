import { Component, OnInit, Input } from '@angular/core';
import { Transaction } from '../transaction';
import _ from 'lodash';

@Component({
  selector: 'app-transaction-record-list',
  templateUrl: './transaction-record-list.component.html',
  styleUrls: ['./transaction-record-list.component.css']
})
export class TransactionRecordListComponent implements OnInit {

  @Input() transactions: Transaction[];

  constructor() { }

  ngOnInit() {
  }

  getSum() {
    return Math.round(_.chain(this.transactions)
      .map(transaction => +transaction.cashflow)
      .sum() * 100) / 100;
  }

  getType(name: string) {
    const _idx = _.indexOf(name, '|');
    if (_idx != -1) {
      return name.substr(0, _idx)
    } else {
      return "";
    }
  }

  getName(name: string) {
    const _idx = _.indexOf(name, '|');
    if (_idx != -1) {
      return name.substr(_idx + 1)
    } else {
      return name;
    }
  }
}
