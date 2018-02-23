import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule }    from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DataService } from './services/data.service';

import { MaterialModule } from './modules/material.module';
import { MessageService } from './services/message.service';

import {TreeCutModule} from './features/tree-cut/tree-cut.module';
import {SkirmishModule} from './features/skirmish/skirmish.module';
import {ClanInfoModule} from './features/clan-info/clan-info.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    TreeCutModule,
    SkirmishModule,
    ClanInfoModule
  ],
  providers: [DataService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
