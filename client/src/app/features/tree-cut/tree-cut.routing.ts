import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import {TreeCutComponent} from './components/tree-cut.component';

const routes: Routes = [ { path: 'holz', component: TreeCutComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreeCutRoutingModule { }