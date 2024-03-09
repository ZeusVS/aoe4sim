const path = require('path')

// The url to the aoe4world repo's location of all civilizations
const civURL = 'https://github.com/aoe4world/data/tree/main/civilizations';
// The url to the aoe4world repo's location of all units
const unitURL = 'https://github.com/aoe4world/data/tree/main/units';
const rawUnitURL = 'https://raw.githubusercontent.com/aoe4world/data/main/units';

// Get all the current possible civilizations in the game
async function getCivs() {
    try {
        const response = await fetch(civURL);
        const json = await response.json();
        const rawCivs = json.payload.tree.items;
        const civs = [];
        for (const civ of rawCivs) {
            civs.push(path.parse(civ.name).name);
        }
        return civs;
    } catch (err) {
        console.log(err.message);
        // What else to do on fail?
    }
}

// Get all the stats for the given unit and civ
async function getStats(civ, unit) {
    try {
        const response = await fetch(`${rawUnitURL}/${civ}/${unit}.json`);
        const rawStats = await response.json();
        const stats = {
            id: rawStats.id,
            baseId: rawStats.baseId,
            name: rawStats.name,
            classes: rawStats.classes,
            hitpoints: rawStats.hitpoints,
            weapons: rawStats.weapons,
            armor: rawStats.armor,
            movement: rawStats.movement,
        }
        return stats;
    } catch (err) {
        console.log(err.message);
        // What else to do on fail?
    }
}

// Get all the current possible units for the given civ
async function getUnits(civ) {
    try {
        const response = await fetch(`${rawUnitURL}/${civ}.json`);
        const json = await response.json();
        const rawUnits = json.data;
        const units = [];
        for (const unit of rawUnits) {
            // Removed certain classes of units
            if (!unit.classes.includes('ship') && 
                !unit.classes.includes('warship') &&
                // Also removes villagers, add them back in later?
                !unit.classes.includes('worker') &&
                !unit.classes.includes('siege') &&
                // I think the healing logic can be added easily later
                // will put them back in then
                !unit.classes.includes('religious')) {
                units.push(path.parse(unit.id).name);
            }
        }
        return units;
    } catch (err) {
        console.log(err.message);
        // What else to do on fail?
    }
}

module.exports = {
    getCivs,
    getUnits,
    getStats,
}
