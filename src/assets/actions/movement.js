function allowActionUse(targetTile, sourceUnit, board, units){
    if(!targetTile.unitId && targetTile.unitId != 0 && sourceUnit.actionsLeft >= 1){
        return true;
    }else{
        return false;
    }
}
function useAction(targetTile, sourceUnit, board, units){

}
module.exports={
    allowActionUse:allowActionUse,
    useAction:useAction,
    color:"white"
}