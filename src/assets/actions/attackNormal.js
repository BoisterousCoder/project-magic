let dealDamage = require('./utils/dealDamage.js')

function checkIfValidTarget(targetTile, sourceUnit, board, units, cardAction){
    if((targetTile.unitId || targetTile.unitId == 0) && sourceUnit.actionsLeft >= cardAction.cost){
        return true;
    }else{
        return false;
    }
}
function useAction(targetTile, sourceUnit, game, cardAction){
    console.log('Attacking Unit');
    game.setUnit(sourceUnit.id, {
        actionsLeft:sourceUnit.actionsLeft-cardAction.cost
    });
    dealDamage(targetTile, sourceUnit, game, false);
}
module.exports={
    checkIfValidTarget:checkIfValidTarget,
    useAction:useAction,
    color:"red",
    name:"Attack",
    ref:"attackNormal",
    img:"imgs/attackNormal.svg"
}