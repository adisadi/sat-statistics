import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import {ClanInfoComponent} from './components/clan-info.component';

const routes: Routes = [ { path: 'clan-info', component: ClanInfoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClanInfoRoutingModule { }