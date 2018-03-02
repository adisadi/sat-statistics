import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../modules/material.module';
import { BattleLogRoutingModule } from './battle-log.routing';
import { SharedModule } from '../../shared/shared.module';

import { BattleLogComponent } from './components/battle-log.component';
import { BattleLogService } from './services/battle-log.service';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    BattleLogRoutingModule
  ],
  declarations: [BattleLogComponent],
  exports: [BattleLogComponent],
  providers: [BattleLogService]
})
export class BattleLogModule { }
