import { Component, OnInit, Input, OnChanges, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Transaction } from '../transaction';
import * as moment from 'moment';
import { fromEvent } from 'rxjs';
import _ from 'lodash';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit, OnChanges {
  @ViewChild('fileImport') _file: ElementRef;

  @Input() transactions: Transaction[];
  @Output() transactionsChange = new EventEmitter();

  private today: string = moment(Date.now()).format('YYYY-MM-DD');

  onChange($event) {
    this.transactionsChange.emit(this.transactions)
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  getSum() {
    return _.chain(this.transactions)
      .map(transaction => +transaction.cashflow)
      .sum();
  }

  addTransaction() {
    this.transactions.push(<Transaction> {
      name: "" ,
      date: this.today,
      cashflow: 0
    });
    this.onChange(null);
  }

  swapTransaction(tA, tB) {
    const _transaction = this.transactions[tA];
    this.transactions[tA] = this.transactions[tB];
    this.transactions[tB] = _transaction;
  }

  up(transactionIndex) {
    this.swapTransaction(transactionIndex, transactionIndex - 1);
    this.onChange(null);
  }

  down(transactionIndex) {
    this.swapTransaction(transactionIndex, transactionIndex + 1);
    this.onChange(null);
  }

  remove(transactionIndex) {
    this.transactions.splice(transactionIndex, 1);
    this.onChange(null);
  }

  clearTransaction() {
    if (window.confirm('真的要清空吗？')) {
      this.transactions.length = 0;
      this.onChange(null);
    }
  }

  importTransaction() {
    let file = this._file.nativeElement.files[0];
    let reader = new FileReader();
    reader.onload = e => {
      this.transactions.splice(0, this.transactions.length, ...JSON.parse(reader.result));
      this.onChange(null);
    }
    reader.readAsText(file);
  }

  download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
      var event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      pom.dispatchEvent(event);
    }
    else {
      pom.click();
    }
  }

  exportTransaction() {
    const data = JSON.stringify(this.transactions);
    this.download('export.json', data);
  }
}
