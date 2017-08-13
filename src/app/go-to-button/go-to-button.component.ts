/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'go-to-button',
  templateUrl: './go-to-button.component.pug',
  styleUrls: ['./go-to-button.component.css']
})
export class GoToButtonComponent implements OnInit {
  @Input() layout;
  @Input() buttonLayout;
  @Input() scale;
  @Input() location;
  @Input() locations:boolean[];
  ngOnInit() {
  }
  onClick(event){
    for(let i in this.locations){
      this.locations[i]=false;
    }
    this.locations[this.location] = true;
  }
}
