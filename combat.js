class Unit {
    // team -1 for player 1 and team 1 for player 2, makes sense right?
    constructor(x, y, team, stats) {
        this.position = { x, y };
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

function placeUnitGroup(deployedArmy, x, side, units, height) {
    const direction = x < 0 ? -1 : 1;
    let y = Math.ceil(height / 2);
    // loop over all units types in the group
    for (let unitType of units) {
        // per unit type loop over each individual unit
        for (let unit = 0; unit < unitType.amount; unit++) {
            // if the y position is lower than -height/2, go to the top of the next column
            if (y < -height / 2 - 1) {
                y = Math.ceil(height / 2);
                x += direction;
            }
            // placement of the unit itself
            // remove amount from the unit, we will not need it, keep things clean
            let { amount, ...stats } = unitType;
            let unit = new Unit(x, y, side, stats);
            deployedArmy.push(unit);
            // go to next vertical position
            y--;
        }
    }
    // return the x position for the next group
    return x;
}

// This function edits deployedArmy in place and doesn't return anything
function placeArmy(deployedArmy, army, side) {
    // Create array with all unit groups
    const groups = ['melee', 'ranged',  'religious', 'siege'];
    // Create array with all units divided into groups
    let units = groups.map(group => army.filter(unit => unit.classes.includes(group)));
    // Add worker units to the melee group
    const workerUnits = army.filter(unit => unit.classes.includes('worker'));
    units[0] = units[0].concat(workerUnits);
    // Create array with the amount of each group
    const amounts = units.map(group => group.reduce((acc, unit) => acc + unit.amount, 0));
    // Create array with the height of each group
    const heights = amounts.map(amount => Math.round(Math.sqrt(amount/2)) * 2);

    // Melee units will start placement at 1 tile in their respective direction
    let x = side;
    // Initialise position to the top right corner of the placement grid
    x = placeUnitGroup(deployedArmy, x, side, units[0], heights[0]);
    // Offset the x position by 2 tiles to make room for the next group
    x += side * 2;
    x = placeUnitGroup(deployedArmy, x, side, units[1], heights[1]);
}

function simulationLoop(units, lastUpdateTime) {
    // Check the time at the beginning of the loop
    const now = Date.now();
    // Check the deltaTime in seconds
    const deltaTime = (now - lastUpdateTime) / 1000;
    // Set lastUpdateTime to now for next loop
    lastUpdateTime = now;
    // Loop over all units and update them
    units.forEach((unit) => {
        unit.update(deltaTime);
    });
    // Refire the loop every 100ms
    // Replace with requestAnimationFrame if I want to animate the combat
    setTimeout(() => simulationLoop(units, lastUpdateTime), 100);
}

// Look into using node-canvas to visualise the combat simulation
function simulateCombat(armies) {
    const deployedArmy = [];
    // army1 will be placed in negative x direction, army2 in positive x direction
    placeArmy(deployedArmy, armies.army1, -1);
    placeArmy(deployedArmy, armies.army2, 1);
    // Start the loop with the deployedArmy and the current time
    simulationLoop(deployedArmy, Date.now());
}

module.exports = {
    simulateCombat,
}
