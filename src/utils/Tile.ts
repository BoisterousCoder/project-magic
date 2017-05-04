import {Point} from './Point';
export class Tile extends Point{
    color:string='blue';
    units = [];
    private __entrances:number[]=[1,1,1,0];
    get dispalyId(){
        return 'land_3way';
    }
    get rotation(){
        return 270;
    }
    get printX(){
        return this.x*Math.sin((this.rotation/180)*Math.PI);
    }
    get printY(){
        return this.y*Math.cos((this.rotation/180)*Math.PI);
    }
    get entrances(){
        return this.__entrances
    }
    set entrances(entrances:number[]){

    }
}