import { BrowserModule } from '@angular/platform-browser';
import { NgModule,LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { DataService } from './services/data.service';

import { MaterialModule } from './modules/material.module';

import {TreeCutModule} from './features/tree-cut/tree-cut.module';
import {SkirmishModule} from './features/skirmish/skirmish.module';
import {ClanInfoModule} from './features/clan-info/clan-info.module';
import {PersonalStatsModule} from './features/personal-stats/personal-stats.module';
import { BattleLogModule } from './features/battle-log/battle-log.module';


import localedeCH from '@angular/common/locales/de-CH';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localedeCH);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    TreeCutModule,
    SkirmishModule,
    ClanInfoModule,
    PersonalStatsModule,
    BattleLogModule
  ],
  providers: [DataService,{ provide: LOCALE_ID, useValue: "de-CH" }],
  bootstrap: [AppComponent]
})
export class AppModule { }
