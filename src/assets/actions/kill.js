function checkIfValidTarget(targetTile, sourceUnit, board, units){
    if(targetTile.unitId || targetTile.unitId == 0){
        return true;
    }else{
        return false;
    }
}
function useAction(targetTile, sourceUnit, game){
    console.log('Appling Death to a Unit');
    game.setUnit(targetTile.unitId);
}
module.exports={
    checkIfValidTarget:checkIfValidTarget,
    useAction:useAction,
    name:"kill",
    ref:"kill",
    img:"move.svg"
}