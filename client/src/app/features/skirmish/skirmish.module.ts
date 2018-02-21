import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkirmishRoutingModule } from './skirmish.routing';

import { SkirmishComponent } from './components/skirmish.component';

@NgModule({
  imports: [
    CommonModule,
    SkirmishRoutingModule
  ],
  declarations: [ SkirmishComponent],
  exports:[SkirmishComponent]
})
export class SkirmishModule { }
