const { getCivs, getUnits, getStats } = require('./getData.js');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

// Set up an async input function that we can reuse and make it return a promise
async function input(question) {
    return new Promise((resolve) => {
        readline.question(question, resolve);
    });
}

// Make a function to get a valid positive int from the user
async function inputAmount(question) {
    let answer;
    do {
        answer = await input(question);
    } while (answer != parseInt(answer) || answer <= 0);
    return answer;
}

// Make a function to get a valid answer from the user
async function inputQuestion(question, validAnswers) {
    let answer;
    do {
        answer = await input(question);
    } while (!validAnswers.includes(answer));
    return answer;
}

async function getArmy(civ, player) {
    const army = [];
    const possibleUnits = await getUnits(civ);
    while (true) {
        const unit = await inputQuestion(`Add unit to player ${player} army\n${possibleUnits}\n`, possibleUnits);
        const unitStats = await getStats(civ, unit);
        const unitQt = Number(await inputAmount(`Number of ${unit} units to place\n`));
        unitStats.amount = unitQt;
        if (army.find(unit => unit.id === unitStats.id)) {
            army.find(unit => unit.id === unitStats.id).amount += unitQt
        } else {
            army.push(unitStats);
        }
        console.log(`Added ${unitQt} unit(s) of ${unit} to the army of player ${player}`);
        const progress = await inputQuestion('(A)dd another unit or (C)ontinue?\n', ['a', 'A', 'c', 'C']);
        if (progress === 'c' || progress === 'C') {
            break;
        }
    }
    return army;
}

async function getPlayerInput(player) {
    // Get all currently existing civs in the game
    const possibleCivs = await getCivs();
    // Get civ
    const civ = await inputQuestion(`Give civ for player ${player}\n${possibleCivs}\n`, possibleCivs);
    //Get army
    const army = await getArmy(civ, player);
    return {civ, army}
}

async function getInput() {
    // Get civ and army and unpack them into variables
    const {civ: civ1, army: army1} = await getPlayerInput(1);
    const {civ: civ2, army: army2} = await getPlayerInput(2);
    // Make sure the readline gets closed
    readline.close();
    // Return everything as an object
    return {civ1, army1, civ2, army2}
}

module.exports = {
    getInput,
}
