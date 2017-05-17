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