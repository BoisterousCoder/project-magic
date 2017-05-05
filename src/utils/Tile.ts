import {Point} from './Point';
export class Tile extends Point{
    color:string='blue';
    borderColor:string='black';
    id:number;
    units = [];
    private __displayId:string = 'land_3way';
    private __rotation:number = 0;
    private __entrances:number[]=[1,1,1,0];
    get dispalyId(){
        return this.__displayId;
    }
    get rotation(){
<<<<<<< HEAD
        return this.__rotation;
=======
        return 270;
    }
    get printX(){
        return this.x*Math.sin((this.rotation/180)*Math.PI);
    }
    get printY(){
        return this.y*Math.cos((this.rotation/180)*Math.PI);
>>>>>>> origin/master
    }
    get entrances(){
        return this.__entrances
    }
    set entrances(entrances:number[]){
        switch(entrances){
            case([1,0,0,0]):
                this.__displayId = 'land_1way';
                this.__rotation = 0;
            break;
            case([0,1,0,0]):
                this.__displayId = 'land_1way';
                this.__rotation = 0;
            break;
            case([1,1,0,0]):
                this.__displayId = 'land_2way_curve';
                this.__rotation = 0;
            break;
            case([0,0,1,0]):
                this.__displayId = 'land_1way';
                this.__rotation = 0;
            break;
            case([1,0,1,0]):
                this.__displayId = 'land_2way_strait';
                this.__rotation = 0;
            break;
            case([1,1,1,0]):
                this.__displayId = 'land_3way';
                this.__rotation = 0;
            break;
            case([0,0,0,1]):
                this.__displayId = 'land_1way';
                this.__rotation = 0;
            break;
            case([1,0,0,1]):
                this.__displayId = 'land_2way_curve';
                this.__rotation = 0;
            break;
            case([0,1,0,1]):
                this.__displayId = 'land_2way_strait';
                this.__rotation = 0;
            break;
            case([1,1,0,1]):
                this.__displayId = 'land_3way';
                this.__rotation = 0;
            break;
            case([0,0,1,1]):
                this.__displayId = 'land_2way_curve';
                this.__rotation = 0;
            break;
            case([1,0,1,1]):
                this.__displayId = 'land_3way';
                this.__rotation = 0;
            break;
            case([0,1,1,1]):
                this.__displayId = 'land_3way';
                this.__rotation = 0;
            break;
            case([1,1,1,1]):
                this.__displayId = 'land_4way';
                this.__rotation = 0;
            break;
        }
    }
}