import { getJSON } from './getJSON';
import { Point } from './Point'

export function getUnitTypes(callback){
    getJSON('cards/cards.json', function(data){
        let unitTypeList = data.cards;
        let unitTypes = [];
        for(let unitName of unitTypeList){
            let folderPath = 'cards/'+unitName+'/'
            getJSON(folderPath+'info.json', function(unitType){
                unitType.typeId = unitTypes.length;
                unitType.folderPath = 'assets/' + folderPath;
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
    folderPath:string;
    rotation:number = 0;
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
}