const path = require('path')

// The url to the aoe4world repo's location of all civilizations
const civURL = 'https://github.com/aoe4world/data/tree/main/civilizations';
// The url to the aoe4world repo's location of all units
const unitURL = 'https://github.com/aoe4world/data/tree/main/units';

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
        const response = await fetch(`${unitURL}/${civ}/${unit}.json?raw=true`);
        const rawStats = await response.json();
        const stats = {
            id: rawStats.id,
            name: rawStats.name,
            classes: rawStats.classes,
            hitpoints: rawStats.hitpoints,
            weapons: rawStats.weapons,
            armor: rawStats.armor,
            movement: rawStats.movement,
        }
        console.log(stats)
        return stats;
    } catch (err) {
        console.log(err.message);
        // What else to do on fail?
    }
}

// Get all the current possible units for the given civ
async function getUnits(civ) {
    try {
        const response = await fetch(`${unitURL}/${civ}`);
        const json = await response.json();
        const rawUnits = json.payload.tree.items;
        const units = [];
        for (const unit of rawUnits) {
            units.push(path.parse(unit.name).name);
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
