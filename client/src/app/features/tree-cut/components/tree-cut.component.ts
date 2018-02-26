import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatSortable } from '@angular/material';
import { TreeCutService } from '../services/tree-cut.service';

@Component({
  selector: 'app-tree-cut',
  templateUrl: './tree-cut.component.html',
  styleUrls: ['./tree-cut.component.scss']
})
export class TreeCutComponent implements OnInit {


  displayedColumns = ['rank','nickname', 'battles', 'trees_cut', 'trees_cut_avg'];
  dataSource = null;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private treeCutService: TreeCutService) {
    this.treeCutService.getTreeCutStat().then((res) => {

      //Compute Average
      res.forEach(element => {
        element.trees_cut_avg = element.trees_cut / element.battles;
      });

      //Compute Rank
      let i = 1;
      res.sort((a, b) => {
        return b.trees_cut_avg - a.trees_cut_avg;
      }).forEach((element) => {
        element.rank = i++;
      });

      this.dataSource = new MatTableDataSource(res);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.sort.sort(
        <MatSortable>{
          id: 'trees_cut_avg',
          start: 'desc'
        }
      );
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }


}




