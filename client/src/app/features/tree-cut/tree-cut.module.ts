import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../modules/material.module';

import { TreeCutRoutingModule } from './tree-cut.routing';
import { TreeCutComponent } from './components/tree-cut.component';
import { TreeCutService } from './services/tree-cut.service';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    TreeCutRoutingModule
  ],
  declarations: [TreeCutComponent],
  exports: [TreeCutComponent],
  providers: [TreeCutService]
})
export class TreeCutModule { }
