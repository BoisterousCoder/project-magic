import { getJSON } from './getJSON';
import { Point } from './Point'

export function getUnitTypes(callback){
    getJSON('cards/cards.json', function(data){
        let unitTypeList = data.cards;
        let unitTypes = [];
        for(let unitName of unitTypeList){
            getJSON('cards/'+unitName+'/info.json', function(unitType){
                unitType.id = unitTypes.length;
                unitTypes.push(unitType);
                callback(unitTypes)
            });
        }
    });
}

export class Unit extends Point{
    name:string;
    desc:string;
    typeId:number;
    isUnit:boolean;
    cardImage:string;
    unitImage:string;
    constructor(x:number, y:number, typeData){
        super(x, y);
        this.name = typeData.name;
        this.desc = typeData.desc;
        this.typeId = typeData.id;
        this.isUnit = typeData.isUnit;
        this.cardImage = typeData.cardImage;
        this.unitImage = typeData.unitImage || '';
    }
}