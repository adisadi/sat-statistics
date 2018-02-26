import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import {PersonalStatsComponent} from './components/personal-stats.component';

const routes: Routes = [ { path: 'personal-stats', component: PersonalStatsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalStatshRoutingModule { }