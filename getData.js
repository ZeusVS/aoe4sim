const path = require('path')

// The url to the aoe4world repo's location of all civilizations
const civURL = 'https://github.com/aoe4world/data/tree/main/civilizations';
// The url to the aoe4world repo's location of all units
const unitURL = 'https://github.com/aoe4world/data/tree/main/units';
const rawUnitURL = 'https://raw.githubusercontent.com/aoe4world/data/main/units';

// fetchData helper function
async function fetchData(url) {
    try {
        const response = await fetch(url);
        return response.json();
    } catch (err) {
        console.error(`Failed to fetch data from ${url}: ${err.message}`);
    }
}

// Get all the current possible civilizations in the game
async function getCivs() {
    const json = await fetchData(civURL);
    if (!json) return [];
    // json.payload.tree.items is an array of objects, each object has a name property
    // item.name is the full path to the file, we only want the name of the file
    const civs = json.payload.tree.items.map(item => path.parse(item.name).name);
    return civs
}

// Get all the stats for the given unit and civ
async function getStats(civ, unit) {
        const rawStats = await fetchData(`${rawUnitURL}/${civ}/${unit}.json`);
        if (!rawStats) return null;
        const { id, baseId, name, classes, hitpoints, weapons, armor, movement } = rawStats;
        return { id, baseId, name, classes, hitpoints, weapons, armor, movement };
}

// Get all the current possible units for the given civ
async function getUnits(civ) {
    const json = await fetchData(`${rawUnitURL}/${civ}.json`);
    if (!json) return [];
    // Filter out units that are not of the classes we want
    // We can maybe add siege and religious units later
    const excludedClasses = new Set(['ship', 'warship', 'worker', 'siege', 'religious']);
    const filteredUnits = json.data.filter(unit =>
        !unit.classes.some(unitClass => excludedClasses.has(unitClass))
    );
    // Get only the id of the units
    const parsedUnits = filteredUnits.map(unit => unit.id);
    return parsedUnits;
}

module.exports = {
    getCivs,
    getUnits,
    getStats,
}
