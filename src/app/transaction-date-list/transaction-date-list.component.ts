import { Component, OnInit, Input } from '@angular/core';
import { Transaction } from '../transaction';
import _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-transaction-date-list',
  templateUrl: './transaction-date-list.component.html',
  styleUrls: ['./transaction-date-list.component.css']
})
export class TransactionDateListComponent implements OnInit {

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
          date_unix: moment(transaction.date).unix(),
          date_string: moment(transaction.date).format('YYYY-MM-DD'),
          cashflow: +transaction.cashflow
        }))
        .sortBy(transaction => transaction.date_unix)
        .groupBy(transaction => transaction.date_string)
        .mapValues((transaction_group, key) => ({
          date: moment(key).format('LL'),
          transactions: _.sortBy(transaction_group, transaction => transaction.cashflow > 0),
          sum: Math.round(_.sumBy(transaction_group, 'cashflow') * 100) / 100
        }))
        .values()
        .value()
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
