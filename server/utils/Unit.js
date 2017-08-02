/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const CARD_TYPES = require('./getCardTypes.js')();
let Point = require('./Point.js')

class Unit extends Point{
    constructor(x, y, cardTypeId){
        super(x, y);
        this.card = CARD_TYPES[cardTypeId];
        this.actionsLeft = this.card.action.perTurn;
    }
}
module.exports = Unit;