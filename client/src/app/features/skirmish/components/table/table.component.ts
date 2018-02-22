import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatSortable } from '@angular/material';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  private _data: any[];
  @Input()
  set data(d: any[]) {
    this._data = d;
    this.setData();
  }

  get data(): any[] { return this._data; }

  @Input()
  translateFields: any;

  displayedColumns = null
  dataSource = null;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {


  }

  ngOnInit() {
  }

  setData() {
    if (!this._data) return;

    this.displayedColumns = Object.keys(this.data[0]);
    this.dataSource = new MatTableDataSource(this._data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sort.sort(
      <MatSortable>{
        id: 'battles',
        start: 'asc'
      }
    );
  }

}
