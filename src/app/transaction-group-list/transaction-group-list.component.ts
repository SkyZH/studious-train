import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Transaction } from '../transaction';
import _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-transaction-group-list',
  templateUrl: './transaction-group-list.component.html',
  styleUrls: ['./transaction-group-list.component.css']
})
export class TransactionGroupListComponent implements OnInit {

  @Input() transactions: Transaction[];

  constructor() { }

  ngOnInit() {
  }

  getGroup(transactions) {
    return _.chain(transactions)
      .map(transaction => ({
        name: this.getName(transaction.name),
        type: this.getType(transaction.name),
        date: transaction.date,
        cashflow: +transaction.cashflow
      }))
      .sortBy(transaction => moment(transaction.date).unix())
      .groupBy(transaction => transaction.type)
      .mapValues((transaction_group, key) => ({
        type: key,
        transactions: transaction_group,
        sum: Math.round(_.sumBy(transaction_group, 'cashflow') / 100) * 100
      }))
      .values()
      .value()
  }

  getType(name: string) {
    const _idx = _.indexOf(name, '|');
    if (_idx != -1) {
      return name.substr(0, _idx)
    } else {
      return name;
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
