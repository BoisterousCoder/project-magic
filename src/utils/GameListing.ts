/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
export class GameListing{
    name:string;
    id:string;
    timeCreated:string;
    maxPlayers:number = 2;
    currentPlayers:number = 0;
    constructor(name:string, id:string, timeCreated:string){
        this.name = name;
        this.id = id;
        this.timeCreated = timeCreated;
    }
}