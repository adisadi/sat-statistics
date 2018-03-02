import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {BattleLogComponent} from './components/battle-log.component';

const routes: Routes = [ { path: 'battle-log', component: BattleLogComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BattleLogRoutingModule { }