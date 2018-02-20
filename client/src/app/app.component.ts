import { Component } from '@angular/core';

import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private clanInfo: any;
  private title: string;

  constructor(private dataService: DataService) {
    this.dataService.getClanInfo()
      .subscribe((info) => {
        this.clanInfo = info;
        this.title=this.clanInfo.tag;
      });
  }
}
