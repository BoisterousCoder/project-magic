/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const fs = require('fs');
let assetsFolder = 'src/assets/'
module.exports = function(){
    let cardTypeList;
    try{
        cardTypeList = fs.readFileSync(assetsFolder+'units/units.json', 'utf8')
    }catch(err){
        assetsFolder = 'public/assets/'
        cardTypeList = fs.readFileSync(assetsFolder+'units/units.json', 'utf8')
    }
    cardTypeList = JSON.parse(cardTypeList).cards;
    let cardTypes = [];
    for(let cardName of cardTypeList){
        let folderPath = assetsFolder+'units/'+cardName +'/'
        let cardType = fs.readFileSync(folderPath+'info.json', 'utf8')
        cardType = JSON.parse(cardType);
        cardType.typeId = cardTypes.length;
        cardType.refName = cardName;
        cardType.folderPath = 'assets/units/'+cardName+'/';
        cardTypes.push(cardType);
    }
    return cardTypes;
}