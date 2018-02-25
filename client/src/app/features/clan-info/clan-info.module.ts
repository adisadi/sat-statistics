import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../../modules/material.module';
import { DataService } from '../../services/data.service';
import { ClanInfoService } from './services/clan-info.service';

import { ClanInfoRoutingModule } from './clan-info.routing';

import { ClanInfoComponent } from './components/clan-info.component';

@NgModule({
  imports: [
    CommonModule,
    ClanInfoRoutingModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [ClanInfoComponent],
  declarations: [ClanInfoComponent],
  providers: [DataService, ClanInfoService]
})
export class ClanInfoModule { }
