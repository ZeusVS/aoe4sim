function generateReport(userInput, battlefieldResult) {
    // Width of the printed report, make sure it's dividable by 2
    const width = 30;
    // Create a report string that will contain all the details of the battle
    let report = '';

    const alive1 = {};
    const alive2 = {};
    const dead1 = {};
    const dead2 = {};

    for (const unit of battlefieldResult) {
        console.log(unit);
        if (unit.team === -1) {
            if (unit.dead) {
                dead1[unit.stats.name] = (dead1[unit.stats.name] || 0) + 1;
            } else {
                alive1[unit.stats.name] = (alive1[unit.stats.name] || 0) + 1;
            }
        } else {
            if (unit.dead) {
                dead2[unit.stats.name] = (dead2[unit.stats.name] || 0) + 1;
            } else {
                alive2[unit.stats.name] = (alive2[unit.stats.name] || 0) + 1;
            }
        }

    }

    // Debug
    console.log(alive1);
    console.log(alive2);
    console.log(dead1);
    console.log(dead2);

    // Input
    report += '='.repeat(width) + '\n';
    report += '=       Battle Input        =\n';
    report += '='.repeat(width) + '\n';
    // Player 1
    report += 'Player 1:' + `${userInput.civ1}`.padStart(width - 9, ' ') + '\n';
    report += '-'.repeat(width) + '\n';
    report += 'Army:\n';
    for (const unit of userInput.army1) {
        report += `- ${unit.amount} x ${unit.name}\n`;
    }
    report += '='.repeat(width) + '\n';
    // Player 2
    report += 'Player 2:' + `${userInput.civ2}`.padStart(width - 9, ' ') + '\n';
    report += '-'.repeat(width) + '\n';
    report += 'Army:\n';
    for (const unit of userInput.army2) {
        report += `- ${unit.amount} x ${unit.name}\n`;
    }
    // Results
    report += '='.repeat(width) + '\n';
    report += '=       Battle Results       =\n';
    report += '='.repeat(width) + '\n';
    // Player 1
    report += 'Player 1:\n';
    report += '-'.repeat(width) + '\n';
    report += 'Alive:\n';
    for (const unit in alive1) {
        report += `- ${alive1[unit]} x ${unit}\n`;
    }
    report += '\n';
    report += 'Dead:\n';
    for (const unit in dead1) {
        report += `- ${dead1[unit]} x ${unit}\n`;
    }
    report += '='.repeat(width) + '\n';
    // Player 2
    report += 'Player 2:\n';
    report += '-'.repeat(width) + '\n';
    report += 'Alive:\n';
    for (const unit in alive2) {
        report += `- ${alive2[unit]} x ${unit}\n`;
    }
    report += '\n';
    report += 'Dead:\n';
    for (const unit in dead2) {
        report += `- ${dead2[unit]} x ${unit}\n`;
    }
    report += '='.repeat(width) + '\n';

    return report;
}

module.exports = {
    generateReport,
}
