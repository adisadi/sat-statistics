import { Component, OnInit } from '@angular/core';
import { SkirmishService } from '../services/skirmish.service';

@Component({
  selector: 'app-skirmish',
  templateUrl: './skirmish.component.html',
  styleUrls: ['./skirmish.component.scss']
})
export class SkirmishComponent implements OnInit {

  dataSkirmish: any[];
  dates: Date[];
  selectedBaseline: Date | null = null;
  selectedDate: Date = null;

  translatedColumns={
    nickname:"Name",
    battles:"Gefechte",
    piercing_shot_ratio:"Durchschläge/Shots",
    hits_shots_ratio:"Treffer/Shots",
    wins_looses_ratio:"Wins/Looses",
    wins_battles_ratio:"Wins/Gefechte",
    piercings_piercings_rec_ratio:"Durchschläge/Durchschläge erhalten",
    piercing_hits_ratio:"Durchschläge/Treffer"
  };

  constructor(private skirmishService: SkirmishService) {
    this.skirmishService.getDates().subscribe((dates) => {
      if (!dates || dates.length === 0) return;
      this.dates = dates;
      this.selectedBaseline = null;
      this.selectedDate = this.dates[this.dates.length - 1];
      this.loadSkirmishData();
    });
  }

  ngOnInit() {
  }

  onDatesChanged(obj: { date: Date, base: Date }) {
    this.selectedDate = obj.date;
    this.selectedBaseline = obj.base;
    this.loadSkirmishData();
  }

  loadSkirmishData() {
    this.skirmishService.getSkirmishStat(this.selectedBaseline ? this.selectedBaseline.toISOString() : "", this.selectedDate.toISOString())
      .subscribe((res) => {
        this.dataSkirmish = res.map(e => {
          let obj = {};
          if (e.base) {
            obj = {
              nickname: e.nickname,
              battles: e.base.battles - e.current.battles,
              piercing_shot_ratio: ((e.base.piercings - e.current.piercings) / (e.base.shots - e.current.shots)).toFixed(3),
              piercing_hits_ratio: ((e.base.piercings - e.current.piercings) / (e.base.hits - e.current.hits)).toFixed(3),
              hits_shots_ratio: ((e.base.hits - e.current.hits) / (e.base.shots - e.current.shots)).toFixed(3),
              wins_looses_ratio: ((e.base.wins - e.current.wins) / (e.base.losses - e.current.losses)).toFixed(3),
              wins_battles_ratio: ((e.base.wins - e.current.wins) / (e.base.battles - e.current.battles)).toFixed(3),
              piercings_piercings_rec_ratio: ((e.base.piercings - e.current.piercings) / (e.base.piercings_received - e.current.piercings_received)).toFixed(3),

            };
          } else {
            obj = {
              nickname: e.nickname,
              battles: e.current.battles,
              piercing_shot_ratio: (e.current.piercings / e.current.shots).toFixed(3),
              piercing_hits_ratio: (e.current.piercings / e.current.hits).toFixed(3),
              hits_shots_ratio: (e.current.hits / e.current.shots).toFixed(3),
              wins_looses_ratio: (e.current.wins / e.current.losses).toFixed(3),
              wins_battles_ratio: (e.current.wins / e.current.battles).toFixed(3),
              piercings_piercings_rec_ratio: (e.current.piercings / e.current.piercings_received).toFixed(3),

            };
          }
          return obj;
        })
      });
  }



}
