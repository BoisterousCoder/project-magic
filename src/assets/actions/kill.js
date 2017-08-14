function checkIfValidTarget(targetTile, sourceUnit, board, units, cardAction){
    if(targetTile.unitId || targetTile.unitId == 0){
        return true;
    }else{
        return false;
    }
}
function useAction(targetTile, sourceUnit, game, cardAction){
    console.log('Appling Death to a Unit');
    game.setUnit(targetTile.unitId);
}
module.exports={
    checkIfValidTarget:checkIfValidTarget,
    useAction:useAction,
    name:"kill",
    ref:"kill",
    img:"imgs/attackNormal.svg"
}