/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { SideBoardComponent } from './side-board/side-board.component';
import { GoToButtonComponent } from './go-to-button/go-to-button.component';
import { InfoBoardComponent } from './info-board/info-board.component';

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent, 
    SideBoardComponent, 
    GoToButtonComponent, 
    InfoBoardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  bootstrap: [AppComponent],
  providers: []
})
export class AppModule { }
