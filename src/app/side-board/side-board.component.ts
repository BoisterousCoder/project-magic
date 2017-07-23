/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'side-board',
    templateUrl: './side-board.component.html',
    styleUrls: ['./side-board.component.css']
})
export class SideBoardComponent implements OnInit {
    @Input() socket;
    @Input() gameId;
    @Input() scale;
    @Input() minWindowSize;
    @Input() maxWindowSize;
    @Input() isWindowVertical;
    ngOnInit() {

    }
}