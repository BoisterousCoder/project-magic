/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const fs = require('fs');
let assetsFolder = 'src/assets/'
module.exports = function(){
    let cardTypeList;
    try{
        cardTypeList = fs.readFileSync(assetsFolder+'cards/cards.json', 'utf8')
    }catch(err){
        assetsFolder = 'public/assets/'
        cardTypeList = fs.readFileSync(assetsFolder+'cards/cards.json', 'utf8')
    }
    cardTypeList = JSON.parse(cardTypeList).cards;
    let cardTypes = [];
    for(let cardName of cardTypeList){
        let folderPath = assetsFolder+'cards/'+cardName +'/'
        let cardType = fs.readFileSync(folderPath+'info.json', 'utf8')
        cardType = JSON.parse(cardType);
        cardType.typeId = cardTypes.length;
        cardType.folderPath = 'assets/cards/'+cardName+'/';
        cardTypes.push(cardType);
    }
    return cardTypes;
}