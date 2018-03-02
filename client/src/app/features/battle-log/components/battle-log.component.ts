import { Component, OnInit } from '@angular/core';

import { BattleLogService } from '../services/battle-log.service';

@Component({
  selector: 'app-battle-log',
  templateUrl: './battle-log.component.html',
  styleUrls: ['./battle-log.component.scss']
})
export class BattleLogComponent implements OnInit {

  translatedColumnsStats = {
    nickname: "Name",
    last_battle_time: "Letztes Gefecht",
  };
  defaultSort = { column: 'last_battle_time', order: 'desc' };
  displayedColumns = ['nickname', 'last_battle_time'];
  personalStats: any;

  constructor(private battleLogService: BattleLogService) {
    this.battleLogService.getPersonalStat().then((stats) => {
      this.personalStats = stats.map((e) => {
        let obj: { [k: string]: any } = {};
        obj.nickname = e.nickname;
        obj.last_battle_time = new Date(e.last_battle_time * 1000);

        return obj;
      });
    });

  }

  ngOnInit() {
  }

}
