const { getCivs } = require('./getData.js');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

// Wrap `readline.question` in a Promise so that we can use it in an async function
async function inputQuestion(question, validAnswers) {
    let answer;
    do {
        answer = await new Promise((resolve, reject) => {
            readline.question(`Pick ${question}, possible choices: ${validAnswers}\n`, (input) => {
                resolve(input);
            });
        });
    } while (!validAnswers.includes(answer));
    return answer;
}


class inputClass {
    constructor(civ1, army1, civ2, army2) {
        this.civ1 = civ1;
        this.army1 = army1;
        this.civ2 = civ2;
        this.army2 = army2;
        readline.close();
    }
}

async function getInput() {
    // Get possible civs
    possibleCivs = await getCivs();
    // Get possible units for the chosen civ

    // Get user input
    const civ1 = await inputQuestion('player 1 civ', possibleCivs);
    const army1 = await inputQuestion('player 1 army', ['Greek']);
    const civ2 = await inputQuestion('player 2 civ', possibleCivs);
    const army2 = await inputQuestion('player 2 army', ['Greek']);
    // Create inputObject out of the responses we got and return t
    const inputObject = new inputClass(civ1, army1, civ2, army2)
    return inputObject;
}

module.exports = {
    getInput,
}
