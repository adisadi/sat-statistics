import { Component, OnInit } from '@angular/core';

import { PersonalStatsService } from '../services/personal-stats.service';

@Component({
  selector: 'app-personal-stats',
  templateUrl: './personal-stats.component.html',
  styleUrls: ['./personal-stats.component.scss']
})
export class PersonalStatsComponent implements OnInit {

  translatedColumns = {
    nickname: 'Name',
    battles: 'Gefechte',
  };

  stats = ['stronghold_skirmish', 'all', 'random', 'epic',
    'ranked_battles', 'ranked_battles_current', 'ranked_battles_previous', 'company', 'regular_team'];
  selectedStat = 'all';
  dataPersonalStats;
  dates;
  selectedDate;
  defaultSort = { column: 'nickname', order: 'asc' };

  displayedColumns = ['nickname', 'battles'];

  constructor(private personalStatsService: PersonalStatsService) {
    this.personalStatsService.getDates().then((dates) => {
      if (!dates || dates.length === 0) { return; }
      this.dates = dates;

      this.selectedDate = this.dates[this.dates.length - 1];
      this.loadPersonalStats();
    });
  }

  ngOnInit() {
  }

  statChanged() {
    this.loadPersonalStats();
  }

  loadPersonalStats() {
    this.personalStatsService.getPersonalStat(this.selectedStat, undefined, +this.selectedDate)
      .then((res) => {
        this.dataPersonalStats = res.map(e => {
          let obj: { [k: string]: any } = {};

          obj.nickname = e.nickname;
          obj.updated_at = new Date(e.updated_at * 1000);
          obj.last_battle_time = new Date(e.last_battle_time * 1000);
          obj.global_rating=e.global_rating;

          for (let prop in e.current) {
            if (e.base) {
              obj[prop] = e.base[prop] - e.current[prop];
            } else {
              obj[prop] = e.current[prop];
            }
          }

          return obj;
        });
      });
  }

}
