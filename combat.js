class Unit {
    // team -1 for player 1 and team 1 for player 2, makes sense right?
    constructor(x, y, team, stats) {
        this.position = { x: x, y: y};
        this.stats = stats;
        this.team = team;
        this.dead = false;
    }
    update(deltaTime) {
        // Actions to take for each unit every loop of the simulationLoop
        // Pseudocode steps:
        // check if unit has target
            // check if target is still alive
                // if no to one of the above, search new target
        // if target is outside of max range or inside min range
            // move character
        // else
            // attack
            // calculate damage done
                // check if target hp < 0 and set to dead
        // Exit loop if no more targets are available
    }
}

// This function edits deployedArmy in place and doesn't return anything
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
    
    // Each respective group will be placed in it's own formation
    // Each formation will be approximately twice as high as it is wide
    const meleeHeight = Math.round(Math.sqrt(meleeAmt/2)) * 2;
    const rangedHeight = Math.round(Math.sqrt(rangedAmt/2)) * 2;

    // Melee units will start placement at 1 tile
    // Initialise position to the top right corner of the placement grid
    let x = 1 * pos;
    let y = Math.ceil(meleeHeight / 2);
    // loop over all units types in the group
    for (let meleeUnitType of melee) {
        // per unit type loop over each individual unit
        for (let meleeUnit = 0; meleeUnit < meleeUnitType.amount; meleeUnit++) {
            // if the y position is lower than -height/2, go to the top of the next column
            if (y < -meleeHeight / 2) {
                y = Math.ceil(meleeHeight / 2);
                x += pos;
            }
            // placement of the unit itself
            // remove amount from the unit, we will not need it, keep things clean
            let { amount, ...meleeStats } = meleeUnitType;
            let unit = new Unit(x, y, pos, meleeStats);
            deployedArmy.push(unit);

            // go to next vertical position
            y--;
        }
    }

    // Reset position for the ranged unit block
    // make sure there is one tile between the melee and ranged unit group
    x += 2 * pos;
    y = Math.ceil(rangedHeight / 2);
    // Ranged units will start placement at -6 tiles
    for (let rangedUnitType of ranged) {
        // per unit type loop over each individual unit
        for (let rangedUnit = 0; rangedUnit < rangedUnitType.amount; rangedUnit++) {
            // if the y position is lower than -height/2, go to the top of the next column
            if (y < -rangedHeight / 2) {
                y = Math.ceil(rangedHeight / 2);
                x += pos;
            }
            // placement of the unit itself
            // remove amount from the unit, we will not need it, keep things clean
            let { amount, ...rangedStats } = rangedUnitType;
            let unit = new Unit(x, y, rangedStats);
            deployedArmy.push(unit);

            // go to next vertical position
            y--;
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

    // Refire the loop every 100ms
    setTimeout(simulationLoop, 100);
}

// Look into using node-canvas to visualise the combat simulation
function simulateCombat(armies) {
    const deployedArmy = [];
    // army1 will be placed in negative x direction, army2 in positive x direction
    placeArmy(deployedArmy, armies.army1, -1);
    placeArmy(deployedArmy, armies.army2, 1);
    // Start with checking the time
    let lastUpdateTime = Date.now();
    simulationLoop();
}

module.exports = {
    simulateCombat,
}
