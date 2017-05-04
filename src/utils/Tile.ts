import {Point} from './Point';
export class Tile extends Point{
    color:string='blue';
    units = [];
    private __entrances:number[]=[1,1,1,0];
    get dispalyId(){
        return 'land_3way';
    }
    get rotation(){
        return 90;
    }
    get entrances(){
        return this.__entrances
    }
    set entrances(entrances:number[]){

    }
}