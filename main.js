const { getInput } = require('./input.js');
const { simulateCombat } = require('./combat.js');
const { generateReport } = require('./report.js');

async function main() {
    // userInput = Object {civ1, army1, civ2, army2}
    // civ = 'civName'
    // army = [armyunit1, armyunit2,...]
    // armyunit = object {id, name, classes, hitpoints, weapons, armor, movement, amount}
    const userInput = await getInput();
    const battlefieldResult = await simulateCombat(userInput);
    console.log(generateReport(userInput, battlefieldResult));
}

main()
