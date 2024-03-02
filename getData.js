const path = require('path')

// The url to the aoe4world repo's location of all civilizations
const civURL = 'https://github.com/aoe4world/data/tree/main/civilizations';

// Get all the current possible civilizations in the game
async function getCivs() {
    try {
        const response = await fetch(civURL,);
        const json = await response.json();
        const rawCivs = json.payload.tree.items;
        const civs = [];
        for (const civ of rawCivs) {
            civs.push(path.parse(civ.name).name);
        }
        console.log(civs);
        return civs;
    } catch (err) {
        console.log(err.message);
        // What else to do on fail?
    }
}

module.exports = {
    getCivs,
}
