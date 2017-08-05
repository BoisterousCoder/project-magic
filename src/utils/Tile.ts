/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import {Point} from './Point';
export class Tile extends Point{
    color:string='blue';
    id:number;
    unitId:number;
    highlight = false;
    isWater;
    private __isPassable:boolean = true;
    private __displayId:string = 'land_4way';
    private __rotation:number = 0;
    // private __entrances:number[]=[1,1,1,0];
    constructor(x:number, y:number, typeData = undefined){
        super(x, y);
        if(typeData){
            for(let propertyName in typeData){
                if (typeData.hasOwnProperty(propertyName)) {
                    this[propertyName] = typeData[propertyName];
                }
            }
        }
    }
    get isPassable(){
        let isUnitBlocking = (this.unitId || this.unitId == 0);
        return (!isUnitBlocking && !this.isWater) && this.__isPassable;
    }
    get isVissible(){
        return !this.isWater;
    }
    set isPassable(isPassable){
        this.__isPassable = isPassable;
    }
    get dispalyId(){
        return this.__displayId;
    }
    get rotation(){
        return this.__rotation * 90;
    }
    // get entrances(){
    //     return this.__entrances
    // }
    // set entrances(entrances:number[]){
        // switch(entrances.toString()){
        //     case([1,0,0,0].toString()):
        //         this.__displayId = 'land_1way';
        //         this.__rotation = 2;
        //     break;
        //     case([0,1,0,0].toString()):
        //         this.__displayId = 'land_1way';
        //         this.__rotation = -1;
        //     break;
        //     case([1,1,0,0].toString()):
        //         this.__displayId = 'land_2way_curve';
        //         this.__rotation = -1;
        //     break;
        //     case([0,0,1,0].toString()):
        //         this.__displayId = 'land_1way';
        //         this.__rotation = 0;
        //     break;
        //     case([1,0,1,0].toString()):
        //         this.__displayId = 'land_2way_strait';
        //         this.__rotation = 1;
        //     break;
        //     case([0,1,1,0].toString()):
        //         this.__displayId = 'land_2way_curve';
        //         this.__rotation = 0;
        //     break;
        //     case([1,1,1,0].toString()):
        //         this.__displayId = 'land_3way';
        //         this.__rotation = -1;
        //     break;
        //     case([0,0,0,1].toString()):
        //         this.__displayId = 'land_1way';
        //         this.__rotation = 1;
        //     break;
        //     case([1,0,0,1].toString()):
        //         this.__displayId = 'land_2way_curve';
        //         this.__rotation = 2;
        //     break;
        //     case([0,1,0,1].toString()):
        //         this.__displayId = 'land_2way_strait';
        //         this.__rotation = 0;
        //     break;
        //     case([1,1,0,1].toString()):
        //         this.__displayId = 'land_3way';
        //         this.__rotation = 2;
        //     break;
        //     case([0,0,1,1].toString()):
        //         this.__displayId = 'land_2way_curve';
        //         this.__rotation = 1;
        //     break;
        //     case([1,0,1,1].toString()):
        //         this.__displayId = 'land_3way';
        //         this.__rotation = 1;
        //     break;
        //     case([0,1,1,1].toString()):
        //         this.__displayId = 'land_3way';
        //         this.__rotation = 0;
        //     break;
        //     case([1,1,1,1].toString()):
        //         this.__displayId = 'land_4way';
        //         this.__rotation = 0;
        //     break;
        //     default:
        //         console.error('No Matching entrance set found for...');
        //         console.error(entrances);
        //     break
        // }
    // }
}