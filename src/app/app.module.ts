import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionRecordListComponent } from './transaction-record-list/transaction-record-list.component';
import { TransactionDateListComponent } from './transaction-date-list/transaction-date-list.component';
import { TransactionGroupListComponent } from './transaction-group-list/transaction-group-list.component';
import { TransactionChartComponent } from './transaction-chart/transaction-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    TransactionListComponent,
    TransactionRecordListComponent,
    TransactionDateListComponent,
    TransactionGroupListComponent,
    TransactionChartComponent
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
