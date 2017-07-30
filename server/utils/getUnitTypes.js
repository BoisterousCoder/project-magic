/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const fs = require('fs');
let assetsFolder = 'src/assets/'
module.exports = function(){
    let unitTypeList;
    try{
        unitTypeList = fs.readFileSync(assetsFolder+'cards/cards.json', 'utf8')
    }catch(err){
        assetsFolder = 'public/assets/'
        unitTypeList = fs.readFileSync(assetsFolder+'cards/cards.json', 'utf8')
    }
    unitTypeList = JSON.parse(unitTypeList).cards;
    let unitTypes = [];
    for(let unitName of unitTypeList){
        let folderPath = assetsFolder+'cards/'+unitName +'/'
        let unitType = fs.readFileSync(folderPath+'info.json', 'utf8')
        unitType = JSON.parse(unitType);
        unitType.typeId = unitTypes.length;
        unitType.folderPath = 'assets/cards/'+unitName+'/';
        unitTypes.push(unitType);
    }
    return unitTypes;
}