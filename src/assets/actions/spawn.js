const getOwner = require('./utils/getOwner');

function checkIfValidTarget(targetTile, sourceUnit, board, units, cardAction){
    return (targetTile.isPassable && sourceUnit.actionsLeft >= cardAction.cost && sourceUnit.card.refName == 'base');
}
function useAction(targetTile, sourceUnit, game, cardAction){
    console.log('Spawning a ' + cardAction.unit);
    let owner = getOwner(sourceUnit, game);
    game.makeUnit(targetTile.x, targetTile.y, cardAction.unit, owner);
    game.setUnit(sourceUnit.id, {
        actionsLeft:sourceUnit.actionsLeft-cardAction.cost
    });
}
module.exports={
    checkIfValidTarget:checkIfValidTarget,
    useAction:useAction,
    color:"white",
    name:"spawn",
    ref:"spawn",
    img:"imgs/spawn.svg"
}