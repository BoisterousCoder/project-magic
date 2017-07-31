import { getJSON } from './getJSON';
import { Point } from './Point'
export class Unit extends Point{
    card;
    img:string;
    isSelected:boolean = false;
    constructor(x:number, y:number, unitData){
        super(x, y);
        let card = unitData.card;
        this.img = card.folderPath + card.unitImg;
        this.card = card;
    }
}