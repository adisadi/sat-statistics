import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from '../../shared/shared.module';
import { PersonalStatshRoutingModule } from './personal-stats.routing';

import { PersonalStatsComponent } from './components/personal-stats.component';
import { PersonalStatsService } from './services/personal-stats.service';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PersonalStatshRoutingModule
  ],
  exports: [PersonalStatsComponent],
  providers: [PersonalStatsService],
  declarations: [PersonalStatsComponent]
})
export class PersonalStatsModule { }
