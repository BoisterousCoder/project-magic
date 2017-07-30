/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const CARD_TYPES = require('./getCardTypes.js')();

class Unit{
    constructor(x, y, cardTypeId){
        this.x = x;
        this.y = y;
        this.card = CARD_TYPES[cardTypeId];
    }
}
module.exports = Unit;