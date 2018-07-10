import { Component, AfterContentInit, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Transaction } from '../transaction';
import _ from 'lodash';
import * as moment from 'moment';
import * as d3 from 'd3';

const margin = {top: 20, right: 40, bottom: 50, left: 40},
  width = 1280,
  height = 720;

@Component({
  selector: 'app-transaction-chart',
  templateUrl: './transaction-chart.component.html',
  styleUrls: ['./transaction-chart.component.css']
})
export class TransactionChartComponent implements AfterContentInit {
  @Input() transactions: Transaction[];
  @ViewChild('chart') _chart: ElementRef;
  svg: any;
  chartMask: any;
  chartContent: any;
  zoomed: any;

  constructor() { }

  ngAfterContentInit() {
    this.svg = d3.select(this._chart.nativeElement)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate (${margin.left}, ${margin.top})`)
    this.svg.append('rect')
      .attr('x', -margin.left)
      .attr('y', -margin.top)
      .attr('width', margin.left + margin.right + width)
      .attr('height', margin.top + margin.bottom + height)
      .attr('fill', '#ffffff');
    this.svg.append('clipPath')
      .attr('id', 'chartClip')
      .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
    this.chartMask = this.svg.append('g');
    this.chartContent = this.chartMask.append('g')
      .attr('clip-path', 'url(#chartClip)');
    this.update_data(this.transactions);
  }

  update_data(transactions: Transaction[]) {
    const _transactions = _.map(transactions, transaction => ({
      name: this.getName(transaction.name),
      type: this.getType(transaction.name),
      date: moment(transaction.date),
      _date_string: moment(transaction.date).format('YYYY-MM-DD'),
      cashflow: +transaction.cashflow,
      cum: +transaction.cashflow
    }));
    const _stacked_transactions = _.mapValues(
      _.groupBy(_transactions, '_date_string'),
      stack => {
        let d = _.values(_.groupBy(stack, t => t.cashflow > 0));
        for (let i of d) {
          _.forEach(i, (t, idx) => {
            if(idx > 0) t.cum += i[idx - 1].cum;
          })
        }
        return stack;
      }
    );
    const x = d3.scaleTime()
      .domain([
        moment.min(_.map(_transactions, 'date')),
        moment.max(_.map(_transactions, 'date'))
      ])
      .range([0, width]);
    const barWidth = Math.max(x(moment('2018-01-02')) - x(moment('2018-01-01')) - 5, 5);
    const y = d3.scaleLinear()
      .domain([
        _.minBy(_transactions, 'cum').cum,
        _.maxBy(_transactions, 'cum').cum
      ])
      .range([height, 0])
      .nice();
    const color = d3.scaleOrdinal()
      .domain(_.map(_transactions, 'type'))
      .range([
        '#f44336', '#E91E63', '#9C27B0', '#673AB7',
        '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
        '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
        '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
        '#795548', '#9E9E9E', '#607D8B'
      ])

    const init_bar = selection => selection
      .attr('class', 'stack')
      .attr('transform', d => `translate(${x(d[0].date)}, 0)`)
    const init_rect = selection => selection
      .attr('class', 'rect')
      .attr('x', -barWidth / 2)
      // y should be at y(d.cum), and start point is y(d.cum) - y(d.cashflow) + y(0)
      // for cashflow > 0: y = y(d.cum), height = y(d.cashflow) - y(0)
      // for cashflow < 0: y = y(d.cum) - y(d.cashflow) + y(0)
      .attr('y', d => d.cashflow > 0 ? y(d.cum) : y(d.cum) - y(d.cashflow) + y(0))
      .attr('height', d => Math.abs(y(d.cashflow) - y(0)))
      .attr('width', barWidth)
      .attr('fill', d => d.cashflow > 0
        ? d3.rgb(color(d.type)).brighter(0.2)
        : d3.rgb(color(d.type)).darker(0.2))
      .on('mouseover', (d, idx, nodes) => {
        const rect = d3.select(nodes[idx]);
        const tooltip = this.chartContent.append('g');
        tooltip.append('g').data([d]).call(init_tooltip)
        rect.on('mousemove', () => {
          let _y = d3.mouse(this.chartContent.node())[1];
          tooltip.attr('transform', `translate(0, ${_y})`)
        })
        rect.on('mouseout', () => tooltip.remove());
      })
    const init_tooltip = selection => {
      const tooltip = selection;
      const rect = tooltip
        .append('rect')
        .attr('height', 50)
        .attr('fill', '#cccccc')
        .attr('fill-opacity', 0.7)
        .attr('stroke', '#bbbbbb')
        .attr('rx', 5)
        .attr('ry', 5);
      const name = tooltip
        .append('text')
          .attr('class', 'value')
          .attr('alignment-baseline', 'hanging')
          .attr('transform', `translate(5, 5)`)
          .text(d => `${d.type} ${d.name ? '| ' + d.name : ''}`)
      tooltip
        .append('text')
          .attr('class', 'value')
          .attr('alignment-baseline', 'hanging')
          .attr('transform', `translate(5, 25)`)
          .text(d => `${_.round(d.cashflow * 100) / 100} 万元`);
      const __width = Math.max(name.node().getComputedTextLength() + 10, 100);
      rect.attr('width', __width);
      tooltip.attr('transform', d => {
        let _x_end = (this.zoomed ? this.zoomed.applyX(x(d.date)) : x(d.date)) + barWidth + __width;
        if (_x_end <= width) {
          _x_end = x(d.date);
          if (this.zoomed) _x_end = this.zoomed.applyX(_x_end);
          _x_end += barWidth;
        } else {
          _x_end = x(d.date);
          if (this.zoomed) _x_end = this.zoomed.applyX(_x_end);
          _x_end -= __width + barWidth;
        }
        return `translate(${_x_end}, 0)`
      });
    };
    const bars = this.chartContent.selectAll('.stack')
      .data(_.values(_stacked_transactions), (d, i) => _.keys(_stacked_transactions)[i])
      .enter()
      .append('g')
      .call(init_bar)
    bars.selectAll('.rect')
      .data(d => d)
      .enter()
        .append('rect')
        .call(init_rect);
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);
    const gX = this.chartMask.append('g')
      .attr('class', 'xAxis')
      .attr('transform', `translate(0, ${y(0)})`)
      .call(xAxis);
    const gY = this.chartMask.append('g')
      .attr('class', 'yAxis')
      .call(yAxis);
    const zoom = d3.zoom()
      .scaleExtent([1, 40])
      .translateExtent([[0, 0], [width, height]])
      .on('zoom', () => {
        const transform = d3.event.transform;
        // this.chartContent.attr('transform', transform);
        gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
        // gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
        // gX.attr('transform', `translate(0, ${transform.applyY(y(0))})`);
        bars.attr('transform', d => `translate(${transform.applyX(x(d[0].date))}, 0)`)
        this.zoomed = transform;
      });
    this.svg.call(zoom);
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
      return "";
    }
  }
}
