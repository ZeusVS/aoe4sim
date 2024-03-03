class Unit {
    constructor(x, y) {
        this.position = { x: x, y: y};
    }
    update(deltaTime) {
        // Actions to take every 'deltaTime'
    }
}

// placedArmy is object that contains all units on the battlefield
function placeArmy(deployedArmy, army, pos) {
    const ranged = [];
    const melee = [];
    // These ones will be empty for now because we didn't allow siege or religious units
    const religious = [];
    const siege = [];
    // Also immediately calculate the total amount per group
    // We need this value for unit placement
    let meleeAmt = 0;
    let rangedAmt = 0;
    let religiousAmt = 0;
    let siegeAmt = 0;

    // Divide all troops into groups
    for (const unit of army) {
        if (unit.classes.includes('ranged')) {
            ranged.push(unit);
            rangedAmt += unit.amount
        }
        else if (unit.classes.includes('melee')) {
            melee.push(unit);
            meleeAmt += unit.amount
        }
        else if (unit.classes.includes('religious')) {
            religious.push(unit);
            religiousAmt += unit.amount
        }
        else if (unit.classes.includes('siege')) {
            siege.push(unit);
            siegeAmt += unit.amount
        }
        // We would only allow villagers, which would count as melee units
        else if (unit.classes.includes('worker')) {
            melee.push(unit);
            meleeAmt += unit.amount
        }
    }
}

function simulationLoop() {
    // Check the time at the beginning of the loop
    const now = Date.now();
    // Check the deltaTime in seconds
    const deltaTime = (now - lastUpdateTime) / 1000;
    // Set lastUpdateTime to now for next loop
    lastUpdateTime = now;

    units.forEach((unit) => {
        unit.update(deltaTime);
    });
    // Set timeout? Don't think it's needed here
}

// Look into using node-canvas to visualise the combat simulation
function simulateCombat(armies) {
    const deployedArmy = [];
    placeArmy(deployedArmy, armies.army1, -1);
    placeArmy(deployedArmy, armies.army2, 1);
    // Start with checking the time
    let lastUpdateTime = Date.now();
    /* while (true) {
        simulationLoop();
    } */
}

module.exports = {
    simulateCombat,
}
