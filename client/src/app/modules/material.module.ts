import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatSortModule,
  MatTableModule,
  MatPaginatorModule
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule
  ],
})
export class MaterialModule { }


