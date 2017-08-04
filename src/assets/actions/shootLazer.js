let dealDamage = require('./utils/dealDamage.js')

function checkIfValidTarget(targetTile, sourceUnit, board, units){
    if((targetTile.unitId || targetTile.unitId == 0) && sourceUnit.actionsLeft >= 1){
        return true;
    }else{
        return false;
    }
}
function useAction(targetTile, sourceUnit, game){
    console.log('Attacking Unit');
    game.setUnit(sourceUnit.id, {
        actionsLeft:sourceUnit.actionsLeft-1
    });
    dealDamage(targetTile, sourceUnit, game, false);
}
module.exports={
    checkIfValidTarget:checkIfValidTarget,
    useAction:useAction,
    color:"red",
    name:"Shoot A Lazer",
    ref:"shootLazer",
    img:"shootLazer.svg"
}