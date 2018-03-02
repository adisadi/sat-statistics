import { Component } from '@angular/core';

import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  clanInfo: any;
  title: string;
  update_date:Date;
  
  constructor(private dataService: DataService) {
    this.dataService.getClanInfo()
      .then((info) => {
        this.clanInfo = info;
        this.title = this.clanInfo.tag;
      });

      this.dataService.getUpdateDate()
      .then((d)=>{
        this.update_date=d;
      })
  }
}
