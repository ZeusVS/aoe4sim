const { getInput } = require('./input.js');
const { simulateCombat } = require('./combat.js');

async function main() {
    // userInput = Object {civ1, army1, civ2, army2}
    // civ = 'civName'
    // army = [armyunit1, armyunit2,...]
    // armyunit = object {id, name, classes, hitpoints, weapons, armor, movement, amount}
    const userInput = await getInput();
    console.log(userInput);
    simulateCombat(userInput);
}

main()
