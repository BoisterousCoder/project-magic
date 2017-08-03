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
    let targetUnit = game.board[targetTile];
    let damage = Math.max(0, 1 - targetUnit.armor);
    game.setUnit(targetTile.unitId, {
        health: targetUnit.health - damage
    });
}
module.exports={
    checkIfValidTarget:checkIfValidTarget,
    useAction:useAction,
    color:"red",
    name:"Shoot A Lazer",
    ref:"shootLazer",
    img:"shootLazer.svg"
}