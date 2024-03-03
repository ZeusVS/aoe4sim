const { getInput } = require('./input.js');
const { simulateCombat } = require('./combat.js');

async function main() {
    // Get the user's input in the form [civ1, army1, civ2, army2]
    // army = object {armyunit1:amount1, ...}
    // armyunit = object {id, name, classes, hitpoints, weapons, armor, movement}
    const userInput = await getInput();
    simulateCombat(userInput);
}

main()
