function checkIfValidTarget(targetTile, sourceUnit, board, units){
    if(sourceUnit.health <= 0){
        return true;
    }else{
        return false;
    }
}
function useAction(targetTile, sourceUnit, game){
    console.log('Appling Death to Unit');
    game.setUnit(sourceUnit.id);
}
module.exports={
    checkIfValidTarget:checkIfValidTarget,
    useAction:useAction,
    name:"die",
    ref:"die",
    img:"move.svg"
}