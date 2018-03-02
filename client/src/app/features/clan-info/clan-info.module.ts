import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '../../modules/material.module';

import { ClanInfoService } from './services/clan-info.service';
import { ClanInfoRoutingModule } from './clan-info.routing';
import { ClanInfoComponent } from './components/clan-info.component';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ClanInfoRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    SharedModule
  ],
  exports: [ClanInfoComponent],
  declarations: [ClanInfoComponent],
  providers: [ClanInfoService]
})
export class ClanInfoModule { }
