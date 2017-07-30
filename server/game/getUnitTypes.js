const fs = require('fs');
let assetsFolder = 'public/assets/'
module.exports = function(){
    let unitTypeList = fs.readFileSync(assetsFolder+'cards/cards.json', 'utf8')
    unitTypeList = JSON.parse(unitTypeList).cards;
    let unitTypes = [];
    for(let unitName of unitTypeList){
        let folderPath = assetsFolder+'cards/'+unitName +'/'
        let unitType = fs.readFileSync(folderPath+'info.json', 'utf8')
        unitType.typeId = unitTypes.length;
        unitType.folderPath = folderPath;
        unitTypes.push(unitType);
    }
    return unitTypes;
}