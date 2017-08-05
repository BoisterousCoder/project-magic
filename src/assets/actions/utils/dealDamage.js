module.exports = function(targetTile, sourceUnit, game, isArmorPeirceing){
    let targetUnit = game.units[targetTile.unitId];
    let damageDelt;
    if(isArmorPeirceing){
        damageDelt = Math.max(0, sourceUnit.damage);
    }else{
        damageDelt = Math.max(0, sourceUnit.damage - targetUnit.armor);
    }
    game.setUnit(targetTile.unitId, {
        health: targetUnit.health - damageDelt
    });
    
}