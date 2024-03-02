const { getInput } = require('./input.js');

async function main() {
    userInput = await getInput();
    console.log(userInput);
}

main()
