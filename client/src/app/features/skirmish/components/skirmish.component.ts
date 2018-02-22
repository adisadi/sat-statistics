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

  constructor(private skirmishService: SkirmishService) {
    this.skirmishService.getDates().subscribe((dates) => {
      this.dates = dates;
      this.selectedBaseline = null;
      this.selectedDate = new Date(Math.min.apply(null, this.dates));
      this.loadSkirmishData();
    });
  }

  ngOnInit() {
  }

  onDatesChanged(obj: { date: Date, base: Date }) {
    console.log(obj);
    this.loadSkirmishData();


  }

  loadSkirmishData() {
    this.skirmishService.getSkirmishStat(this.selectedBaseline ? this.selectedBaseline.toISOString() : "", this.selectedDate.toISOString())
      .subscribe((res) => {
        this.dataSkirmish = res.map(e => {
          let obj = {
            nickname: e.nickname,
            battles: e.current.battles,
            piercing_shot_ratio:(e.current.piercings/e.current.shots).toFixed(3),
            hits_shots_ratio:(e.current.hits/e.current.shots).toFixed(3),
            wins_looses_ration:(e.current.wins/e.current.losses).toFixed(3),
            wins_battles_ration:(e.current.wins/e.current.battles).toFixed(3),
            piercings_piercings_rec_ration:(e.current.piercings/e.current.piercings_received).toFixed(3),

          };
          return obj;
        })
      });
  }



}
