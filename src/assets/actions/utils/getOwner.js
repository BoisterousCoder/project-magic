module.exports = (unit, game) => {
    let unitOwner;
    for(let owner in game.owner){
        for(let unitId in game.owner[owner]){
            if(game.owner[owner][unitId]){
                if(unitId == unit.id){
                    unitOwner = owner;
                    break;
                }
            }
        }
        if(unitOwner){
            console.log(unitOwner);
            break;
        }
    }
    return unitOwner;
}