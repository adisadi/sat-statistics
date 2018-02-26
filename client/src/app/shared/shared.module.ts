import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';

import {MaterialModule} from '../modules/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [TableComponent],
  exports:[TableComponent]
})
export class SharedModule { }
