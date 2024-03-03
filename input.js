const { getCivs, getUnits, getStats } = require('./getData.js');

// Wrap `readline.question` in a Promise so that we can use it in an async function
async function inputAmount(question) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    let answer;
    do {
        answer = await new Promise((resolve, reject) => {
            readline.question(question, (input) => {
                resolve(input);
            });
        });
    } while (answer != parseInt(answer) || answer <= 0);
    readline.close();
    return answer;
}

async function inputQuestion(question, validAnswers) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    let answer;
    do {
        answer = await new Promise((resolve, reject) => {
            readline.question(question, (input) => {
                resolve(input);
            });
        });
    } while (!validAnswers.includes(answer));
    readline.close();
    return answer;
}

class inputClass {
    constructor(civ1, army1, civ2, army2) {
        this.civ1 = civ1;
        this.army1 = army1;
        this.civ2 = civ2;
        this.army2 = army2;
    }
}

class Army {
    constructor() {

    }
}

async function getInput() {
    // Get all currently existing civs in the game
    const possibleCivs = await getCivs();
    const army1 = []
    const army2 = []

    // Get player 1 civ choice
    const civ1 = await inputQuestion(`Give civ for player 1\n${possibleCivs}\n`, possibleCivs);
    // Get all currently existing units for the chosen civ
    const possibleUnits1 = await getUnits(civ1);
    
    // Get player 1 unit choice
    while (true) {
        const unit = await inputQuestion(`Add unit to player 1 army\n${possibleUnits1}\n`, possibleUnits1);
        const unitStats = await getStats(civ1, unit);
        const unitQt = await inputAmount(`Amount of ${unit} units to place\n`);
        unitStats.amount = Number(unitQt);
        army1.push(unitStats);
        console.log(`Added ${unitQt} unit(s) of ${unit} to the army of player 1`);
        const progress = await inputQuestion('(A)dd another unit or (C)ontinue?\n', ['a', 'A', 'c', 'C']);
        if (progress === 'c' || progress === 'C') {
            break;
        }
    }

    // Get player 2 civ choice
    const civ2 = await inputQuestion(`Give civ for player 2\n${possibleCivs}\n`, possibleCivs);
    // Get all currently existing units for the chosen civ
    const possibleUnits2 = await getUnits(civ2);

    // Get player 2 unit choice
    while (true) {
        const unit = await inputQuestion(`Add unit to player 2 army\n${possibleUnits2}\n`, possibleUnits2);
        const unitStats = await getStats(civ2, unit);
        const unitQt = await inputAmount(`Number of ${unit} units to place\n`);
        unitStats.amount = Number(unitQt);
        army2.push(unitStats);
        console.log(`Added ${unitQt} unit(s) of ${unit} to the army of player 2`);
        const progress = await inputQuestion('(A)dd another unit or (C)ontinue?\n', ['a', 'A', 'c', 'C']);
        if (progress === 'c' || progress === 'C') {
            break;
        }
    }

    // Create inputObject out of the responses we got and return it
    const inputObject = new inputClass(civ1, army1, civ2, army2)
    return inputObject;
}

module.exports = {
    getInput,
}
