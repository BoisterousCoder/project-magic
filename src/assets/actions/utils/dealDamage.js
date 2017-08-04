module.exports = function(targetTile, sourceUnit, game, isArmorPeirceing){
    let targetUnit = game.units[targetTile.unitId];
    let unitAction = sourceUnit.card.action['shootLazer'];
    let damageDelt;
    if(isArmorPeirceing){
        damageDelt = Math.max(0, unitAction.damage);
    }else{
        damageDelt = Math.max(0, unitAction.damage - targetUnit.armor);
    }
    game.setUnit(targetTile.unitId, {
        health: targetUnit.health - damageDelt
    });
    
}