const checkIfPathClear = require('./utils/checkIfPathClear');

function checkIfValidTarget(targetTile, sourceUnit, board, units, cardAction){
    if(targetTile.isPassable && sourceUnit.actionsLeft >= cardAction.cost){
        return checkIfPathClear(targetTile, sourceUnit, board);
    }else{
        // if(!targetTile.isPassable){
        //     console.log('target is not passable');
        // }else if(sourceUnit.actionsLeft >= sourceUnit.card.action.move.cost){
        //     console.log('source unit is out of actions');
        // }else{
        //     console.log('This code shouldn\'t be run. If it is, there is a bug in the code.')
        // }
        return false;
    }
}
function useAction(targetTile, sourceUnit, game, cardAction){
    console.log('Moving Unit');
    game.setUnit(sourceUnit.id, {
        x:targetTile.x,
        y:targetTile.y,
        actionsLeft:sourceUnit.actionsLeft-cardAction.cost
    });
}
module.exports={
    checkIfValidTarget:checkIfValidTarget,
    useAction:useAction,
    color:"white",
    name:"move",
    ref:"move",
    img:"imgs/move.svg"
}