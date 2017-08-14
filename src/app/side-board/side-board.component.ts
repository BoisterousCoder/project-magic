/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { Component, OnInit, Input} from '@angular/core';
import { mapToPointList } from '../../utils/mapToPointList';
import { Point } from '../../utils/Point';

@Component({
    selector: 'side-board',
    templateUrl: './side-board.component.pug',
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
    private getMinMaxOfPointList(pointList){
        let minPoint = new Point();
        let maxPoint = new Point();
        pointList.map((point)=>{
            minPoint.x = Math.min(point.x, minPoint.x);
            maxPoint.x = Math.max(point.x, maxPoint.x);
            minPoint.y = Math.min(point.y, minPoint.y);
            maxPoint.y = Math.max(point.y, maxPoint.y);
        });
        return {minPoint,maxPoint};
    }
    private mapToCommandArray(map){
        let pointList = mapToPointList(map, new Point());
        let minMax = this.getMinMaxOfPointList(pointList);
        let minPoint = minMax.minPoint;
        let maxPoint = minMax.maxPoint;
        let array2d = [];
        for(let point of pointList){
            point = point.distance(minPoint).round();
            if(!array2d[point.x]){
                array2d[point.x] = [];
            }
            array2d[point.x][point.y] = true;
        }
        let commandArray = [];
        let size = new Point(maxPoint.x-minPoint.x, maxPoint.y-minPoint.y);
        for(let x = 0; x <= size.x; x++){
            commandArray[x] = '';
            if(array2d[x]){
                for(let y = 0; y <= size.y; y++){
                    if(array2d[x][y]){
                        commandArray[x] += '1'
                    }else{
                        commandArray[x] += '0'
                    }
                }
            }else{
                for(let y = 0; y <= size.y; y++){
                    commandArray[x] += '0'
                }
            }
        }
        return commandArray;
    }
    getTextSize(type){
        return (this.layout.textSize[type]*this.scale)+"px"
    }
    ngOnInit() {

    }
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
}