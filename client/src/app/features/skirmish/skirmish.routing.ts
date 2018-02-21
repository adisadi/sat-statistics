import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import {SkirmishComponent} from './components/skirmish.component';

const routes: Routes = [ { path: 'skirmish', component: SkirmishComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkirmishRoutingModule { }