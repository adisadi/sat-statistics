import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkirmishRoutingModule } from './skirmish.routing';

import { SkirmishComponent } from './components/skirmish.component';
import { TableComponent } from './components/table/table.component';
import { OptionsComponent } from './components/options/options.component';
import { SkirmishService } from './services/skirmish.service';

import { MaterialModule } from '../../modules/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SkirmishRoutingModule
  ],
  declarations: [SkirmishComponent, TableComponent, OptionsComponent],
  exports: [SkirmishComponent],
  providers: [SkirmishService]
})
export class SkirmishModule { }
