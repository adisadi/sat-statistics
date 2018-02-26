import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatSortable } from '@angular/material';

@Component({
  selector: 'app-shared-table',
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

  @Input()
  defaultSort: { column: string, order: "asc" | "desc" } = undefined;

  @Input()
  displayedColumns: string[];


  allColumns: string[];
  dataSource = null;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {


  }

  ngOnInit() {
  }

  setData() {
    if (!this._data) return;

    this.allColumns = Object.keys(this.data[0]);

    this.dataSource = new MatTableDataSource(this._data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    if (this.defaultSort) {
      this.sort.sort(
        <MatSortable>{
          id: this.defaultSort.column,
          start: this.defaultSort.order
        }
      );
    }
  }

}
