import { Component, OnInit, ViewChild, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import * as Chart from 'chart.js';
import _ from 'lodash';
import { timer } from 'rxjs';
import { Transaction } from './transaction';
import * as moment from 'moment';
import * as d3 from 'd3';
import { environment } from '../environments/environment';

const locale = require('d3-time-format/locale/zh-CN.json');
moment.locale('zh_CN')
d3.timeFormatDefaultLocale(locale);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  @ViewChild('chart') _chart: ElementRef;
  chart: Chart;

  transactions: Transaction[];

  saved: boolean = false;
  error: boolean = false;
  date_range: any = [false, '2018-01-01', '2018-01-01'];
  tab: number = 0;
  subtab: number = 0;

  _VERSION = environment.VERSION

  constructor() {
  }

  ngOnInit() {
    this.load_data();
  }

  onChange($event) {
    this.save_data();
  }

  load_data() {
    this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  }

  save_data() {
    localStorage.setItem('transactions', JSON.stringify(this.transactions))
    this.saved = true;
    timer(1000).subscribe(() => this.saved = false);
  }

  print() {
    window.print();
  }
}
