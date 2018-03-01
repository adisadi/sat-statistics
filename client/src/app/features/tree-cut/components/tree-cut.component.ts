import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TreeCutService } from '../services/tree-cut.service';

@Component({
  selector: 'app-tree-cut',
  templateUrl: './tree-cut.component.html',
  styleUrls: ['./tree-cut.component.scss']
})
export class TreeCutComponent implements OnInit {

  translatedColumns = {
    nickname: 'Name',
    battles: 'Gefechte',
    rank: 'Rang',
    current: 'Holz gefällt',
    trees_cut_avg: 'Holz ø'
  };

  displayedColumns = ['rank', 'nickname', 'battles', 'current', 'trees_cut_avg'];
  dataSource = null;

  defaultSort = { column: 'rank', order: 'asc' };

  constructor(private treeCutService: TreeCutService) {
    this.treeCutService.getTreeCutStat().then((res) => {

      // Compute Average
      res.forEach(element => {
        element.trees_cut_avg = (element.current / element.battles).toFixed(3);
      });

      // Compute Rank
      let i = 1;
      res.sort((a, b) => {
        return b.trees_cut_avg - a.trees_cut_avg;
      }).forEach((element) => {
        element.rank = i++;
      });

      this.dataSource = res;
    });
  }

  ngOnInit() {
  }

}




