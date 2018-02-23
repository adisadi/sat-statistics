import { Component, OnInit } from '@angular/core';

import { DataService } from '../../../services/data.service';
import { ClanInfoService } from '../services/clan-info.service';

@Component({
  selector: 'app-clan-info',
  templateUrl: './clan-info.component.html',
  styleUrls: ['./clan-info.component.scss']
})
export class ClanInfoComponent implements OnInit {

  clanInfo: any;
  clanRatings: any;
  constructor(private dataService: DataService, private clanInfoService: ClanInfoService) {
    this.dataService.getClanInfo()
      .subscribe((info) => {
        this.clanInfo = info;
        console.log(this.clanInfo);
      });
    this.clanInfoService.getClanRating().subscribe((rating) => {

      let temp = [];
      for (let r in rating) {
        if (rating[r].rank_delta) {
          temp.push({ name: r, rank: rating[r].rank, rank_delta: rating[r].rank_delta, value: rating[r].value });
        }
      }

      this.clanRatings = temp;
      console.log(this.clanRatings);
    });
  }

  ngOnInit() {
  }

}
