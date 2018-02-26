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

  tranlatedNames = {
    battles_count_avg: 'Durchschnitt Gefechte',
    battles_count_avg_daily: 'Durchschnitt Gefechte pro Tag',
    efficiency: 'Effizienz',
    fb_elo_rating: 'Gewichtetes ELO Rating Stronghold',
    fb_elo_rating_6: 'ELO Rating Stronghold VI',
    fb_elo_rating_8: 'ELO Rating Stronghold VIII',
    fb_elo_rating_10: 'ELO Rating Stronghold X',
    global_rating_weighted_avg: 'Durchschnitt Globales Rating gewichtete',
    rating_fort: 'Rating Stronghold Gefechte',
    v10l_avg: 'Durchnittliche Anzahl X Panzer pro Clan Member',
    wins_ratio_avg: 'Durchschnitt Siegrate',
    global_rating_avg: 'Durchschnitt Globales Rating'
  };

  constructor(private dataService: DataService, private clanInfoService: ClanInfoService) {
    this.dataService.getClanInfo()
      .then((info) => {
        this.clanInfo = info;
      });
    this.clanInfoService.getClanRating().then((rating) => {

      const temp: any[] = [];
      for (const r in rating) {
        if (rating[r].rank_delta) {
          temp.push({
            name: this.tranlatedNames[r] ? this.tranlatedNames[r] : r,
            rank: rating[r].rank,
            rank_delta: rating[r].rank_delta,
            value: rating[r].value
          });
        }
      }

      this.clanRatings = temp.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    });
  }

  ngOnInit() {
  }

}
