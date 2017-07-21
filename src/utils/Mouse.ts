/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import {Point} from './Point';
export class Mouse{
    isDragging:boolean = false;
    loc:Point;
    locStart:Point;
    viewOffset:Point = new Point();
    moveCallback:any;
    boundsStart:Point;
    boundsEnd:Point;
    get isInBounds(){
        if(this.boundsStart && this.boundsEnd){
            if(this.loc.isInBounds(this.boundsStart, this.boundsEnd)){
                return true;
            }else{
                return false;
            }
        }else{
            return true;
        }
    }
    get onMove(){
        let self = this;
        return function(event, scale=1){
            self.loc = new Point(event.clientX, event.clientY);
            self.loc = self.loc.scale(scale);
            let travelDistance;
            if(self.locStart){
                travelDistance = self.loc.distance(self.locStart);
            }else{
                travelDistance = 0;
            }
            self.moveCallback(travelDistance, self);
            self.locStart = self.loc;
        }
    }
    set onMove(moveCallback:any){
        this.moveCallback = moveCallback;
    }
    onDown(event){
        this.isDragging = true;
    }
    onUp(event){
        this.isDragging = false;
    }
}