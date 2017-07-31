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
    @Input() isFullWindow;
    @Input() scale;
    @Input() minWindowSize;
    @Input() maxWindowSize;
    @Input() layout
    selectedCard;
    @Input() isWindowVertical;
    get isCardSelected(){
        if(this.selectedCard){
            return true;
        }else{
            return false;
        }
    }
    get imgSrc(){
        return this.selectedCard.folderPath + this.selectedCard.cardImg;
    }
    get divX(){
        if(this.isFullWindow){
            return this.layout.viewBox.x * this.scale;
        }else{
            if(this.isWindowVertical){
                return 0;
            }else{
                return this.minWindowSize;
            }
        }
    }
    get divY(){
        if(this.isFullWindow){
            return this.layout.viewBox.y * this.scale;
        }else{
            if(!this.isWindowVertical){
                return 0;
            }else{
                return this.minWindowSize;
            }
        }
    }
    get divWidth(){
        if(this.isFullWindow){
            if(this.isWindowVertical){
                return this.maxWindowSize - 2*this.layout.viewBox.x*this.scale;
            }else{
                return this.minWindowSize - 2*this.layout.viewBox.x*this.scale;
            }
        }else{
            if(this.isWindowVertical){
                return this.maxWindowSize-this.minWindowSize;
            }else{
                return this.minWindowSize
            }
        }
    }
    get divHeight(){
        if(this.isFullWindow){
            return this.layout.viewBox.height*this.scale;
        }else{
            if(!this.isWindowVertical){
                return this.maxWindowSize-this.minWindowSize;
            }else{
                return this.minWindowSize
            }
        }
    }
    ngOnInit() {

    }
}