import { Component, OnInit, EventEmitter, Output,Input } from '@angular/core';

import { SkirmishService } from '../../services/skirmish.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {

  @Input()
  dates: Date[];

  @Input()
  selectedBaseline: Date;
  @Input()
  selectedDate: Date;

  @Output()
  onDatesChanged = new EventEmitter<{ date: Date, base: Date }>();

  constructor() {

  }

  ngOnInit() {
  }

  datesChanged() {
    console.log('dateChanged');
    this.onDatesChanged.emit({date:this.selectedDate,base:this.selectedBaseline});
  }

}
