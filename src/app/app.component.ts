import { Component, AfterViewInit, OnInit, ViewChild, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import * as Chart from 'chart.js';
import _ from 'lodash';
import { timer } from 'rxjs';
import { Transaction } from './transaction';
import * as _moment from 'moment';
import * as momentRange from 'moment-range'
const moment = momentRange.extendMoment(_moment);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'app';
  @ViewChild('chart') _chart: ElementRef;
  chart: Chart;

  transactions: Transaction[];

  saved: boolean = false;
  error: boolean = false;
  date_range: any = [false, '2018-01-01', '2018-01-01'];

  constructor() {
  }

  private getArrayAt(x, y, s) {
    let d = _.times(s, _.constant(0));
    d[x] = y;
    return d;
  }

  public generate_data(): any {
    const __range = moment.range(moment(this.date_range[1]), moment(this.date_range[2]));
    const __transactions = this.date_range[0]
      ? _.filter(this.transactions, transaction => __range.contains(moment(transaction.date)))
      : this.transactions;
    const dates = _.chain(__transactions)
      .filter(transaction => transaction.date)
      .map(transation => moment(transation.date))
      .value();

    const [d_min, d_max] = this.date_range[0]
      ? [moment(this.date_range[1]), moment(this.date_range[2])]
      : [moment.min(dates), moment.max(dates)]

    if (!_.every(dates, date => date.year() >= 2010) || d_max.diff(d_min, 'days') >= 1000) {
      return null;
    }

    const dateRange = moment.range(d_min, d_max);

    const days = Array.from(dateRange.by('day'));

    const data = _.chain(__transactions)
      .filter(transaction =>
        transaction.date &&
        transaction.cashflow &&
        transaction.name
      )
      .map(transaction => ({
        x: _.findIndex(days, day => day.diff(moment(transaction.date)) >= 0),
        y: transaction.cashflow,
        name: transaction.name
      }))
      .value();
    const red_t = "rgba(255, 99, 132, 0.2)";
    const green_t = "rgba(75, 192, 192, 0.2)";
    const red = "rgba(255, 99, 132, 1)";
    const green = "rgba(75, 192, 192, 1)";
    const backgroundColor = _.map(data, data => (data.y >= 0 ? red : green));
    const borderColor = _.map(data, data => (data.y >= 0 ? red : green));
    return {
      datasets: _.zip(data, backgroundColor, borderColor).map(d => ({
        data: this.getArrayAt(d[0].x, d[0].y, _.size(days)),
        backgroundColor: d[1],
        borderColor: d[2]
      })),
      labels: _.map(days, day => day.format('YY/MM/DD'))
    }
  }

  ngOnInit() {
    this.load_data();
  }

  onChange($event) {
    this.save_data();
    this.update_data();
  }

  ngAfterViewInit() {
    this.chart = new Chart(this._chart.nativeElement, {
      "type": "bar",
      "data": {
        "datasets": [{ data: [] }]
      },
      "options": {
        responsive: true,
        scales: {
          xAxes:[{
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]
        },
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const point = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              const transaction = this.transactions[tooltipItem.datasetIndex];
              return `${transaction.name}: ${point}万元`
            }
          }
        }
      }
    });
    this.update_data();
  }

  update_data() {
    const d = this.generate_data();
    if (d) {
      this.error = false;
      this.chart.data.datasets = d.datasets;
      this.chart.data.labels = d.labels;
      this.chart.update();
    } else {
      timer(1).subscribe(() => this.error = true);
    }
  }

  load_data() {
    this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  }

  save_data() {
    localStorage.setItem('transactions', JSON.stringify(this.transactions))
    this.saved = true;
    timer(1000).subscribe(() => this.saved = false);
  }
}
