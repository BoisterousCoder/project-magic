import {Point} from './Point';
export class Tile extends Point{
    color:string='blue';
    id:number;
    unitIds:Number[] = [];
    private __displayId:string = 'land_3way';
    private __rotation:number = 0;
    private __entrances:number[]=[1,1,1,0];
    onClick(socket){
        socket.emit('clickedTile', this.id);
    }
    get dispalyId(){
        return this.__displayId;
    }
    get rotation(){
        return this.__rotation * 90;
    }
    get entrances(){
        return this.__entrances
    }
    set entrances(entrances:number[]){
        switch(entrances.toString()){
            case([1,0,0,0].toString()):
                this.__displayId = 'land_1way';
                this.__rotation = 2;
            break;
            case([0,1,0,0].toString()):
                this.__displayId = 'land_1way';
                this.__rotation = -1;
            break;
            case([1,1,0,0].toString()):
                this.__displayId = 'land_2way_curve';
                this.__rotation = -1;
            break;
            case([0,0,1,0].toString()):
                this.__displayId = 'land_1way';
                this.__rotation = 0;
            break;
            case([1,0,1,0].toString()):
                this.__displayId = 'land_2way_strait';
                this.__rotation = 1;
            break;
            case([0,1,1,0].toString()):
                this.__displayId = 'land_2way_curve';
                this.__rotation = 0;
            break;
            case([1,1,1,0].toString()):
                this.__displayId = 'land_3way';
                this.__rotation = -1;
            break;
            case([0,0,0,1].toString()):
                this.__displayId = 'land_1way';
                this.__rotation = 1;
            break;
            case([1,0,0,1].toString()):
                this.__displayId = 'land_2way_curve';
                this.__rotation = 2;
            break;
            case([0,1,0,1].toString()):
                this.__displayId = 'land_2way_strait';
                this.__rotation = 0;
            break;
            case([1,1,0,1].toString()):
                this.__displayId = 'land_3way';
                this.__rotation = 2;
            break;
            case([0,0,1,1].toString()):
                this.__displayId = 'land_2way_curve';
                this.__rotation = 1;
            break;
            case([1,0,1,1].toString()):
                this.__displayId = 'land_3way';
                this.__rotation = 1;
            break;
            case([0,1,1,1].toString()):
                this.__displayId = 'land_3way';
                this.__rotation = 0;
            break;
            case([1,1,1,1].toString()):
                this.__displayId = 'land_4way';
                this.__rotation = 0;
            break;
            default:
                console.error('No Matching entrance set found for...');
                console.error(entrances);
            break
        }
    }
}