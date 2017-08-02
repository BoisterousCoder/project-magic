function checkIfValidTarget(targetTile, sourceUnit, board, units){
    if(!targetTile.unitId && targetTile.unitId != 0 && sourceUnit.actionsLeft > 0){
        return true;
    }else{
        return false;
    }
}
function useAction(targetTile, sourceUnit, game){
    console.log('Moving Unit');
    game.setUnit(sourceUnit.id, {
        x:targetTile.x,
        y:targetTile.y,
        actionsLeft:sourceUnit.actionsLeft-1
    });
}
module.exports={
    checkIfValidTarget:checkIfValidTarget,
    useAction:useAction,
    color:"white"
}