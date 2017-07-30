/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const UNIT_TYPES = require('./getUnitTypes.js')();

class Unit{
    constructor(x, y, typeId){
        this.x = x;
        this.y = y;
        let typeData = UNIT_TYPES[typeId];
        for(let propertyName in typeData){
            if (typeData.hasOwnProperty(propertyName)) {
                this[propertyName] = typeData[propertyName];
            }
        }
    }
}
module.exports = Unit;