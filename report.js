function generateReport(userInput, battlefieldResult) {
    // Create a report string that will contain all the details of the battle
    let report = '';

    report += 'Battle Report\n'
    report += '='.repeat(20) + '\n';
    report += 'Player 1\n' 
    report += '-'.repeat(20) + '\n';
    report += `Civilization: ${userInput.civ1}\n`;
    report += 'Army:\n' 
    for (const unit of userInput.army1) {
        report += `- ${unit.amount} x ${unit.name}\n`;
    }
    report += '='.repeat(20) + '\n';
    report += 'Player 2\n' 
    report += '-'.repeat(20) + '\n';
    report += `Civilization: ${userInput.civ2}\n`;
    report += 'Army:\n' 
    for (const unit of userInput.army2) {
        report += `- ${unit.amount} x ${unit.name}\n`;
    }

    return report;
}

module.exports = {
    generateReport,
}
