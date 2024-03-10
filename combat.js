let isSimulationRunning = true;

// Made my own sleep function
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Unit {
    // team -1 for player 1 and team 1 for player 2, makes sense right?
    constructor(x, y, team, stats) {
        this.position = { x, y };
        this.stats = stats;
        this.team = team;
        this.dead = false;
        this.target = null;
        this.coolDown = 0.0;
    }

    update(deltaTime, battlefield) {
        this.coolDown -= deltaTime;
        // Check if the unit has an alive target
        if (this.target === null || this.target.dead) {
            this.searchForTarget(battlefield)
            // Exit the update function after the simulationn has ended
            if (!isSimulationRunning) {
                return;
            }
        }
        // Calculate the distance to the target
        const diffX = this.target.position.x - this.position.x;
        const diffY = this.target.position.y - this.position.y;
        const distanceToTarget = Math.hypot(diffX, diffY);
        // Determine the weapon and it's range
        // If siege units are added back in we need to determine the weapon based on the target class
        // This because siege units get attacked with fire weapons
        const weapon = this.stats.weapons.find(weapon => !weapon.type.includes('fire'));
        const { min: minRange, max: maxRange } = weapon.range;
        // Check if the target is within range and move or attack accordingly
        if (distanceToTarget > maxRange) {
            this.move(diffX, diffY, deltaTime);
        } else if (distanceToTarget < minRange) {
            this.move(-diffX, -diffY);
        } else {
            // Don't attack if the weapon is on cooldown
            if (this.coolDown <= 0.0) {
                this.attack(weapon);
                // This is an approximation, maybe I should use the data from weapon.durations?
                this.coolDown = weapon.speed;
            }
        }
    }
    
    // This function is O(n^2) and should be improved
    searchForTarget(battlefield) {
        // Find the closest enemy unit
        const enemyTeam = -this.team;
        let closestUnit = null;
        let closestDistance = Infinity;

        for (const unit of battlefield) {
            // Find closest enemy unit
            if (unit.team === enemyTeam && !unit.dead) {
                const distance = this.checkDistanceToUnit(unit);
                if (distance < closestDistance) {
                    closestUnit = unit;
                    closestDistance = distance;
                }
            }
        }
        this.target = closestUnit;
        // End the simulation if there are no more targets
        if (!closestUnit) {
            isSimulationRunning = false;
        }
    }
    
    checkDistanceToUnit(unit) {
        const diffX = unit.position.x - this.position.x;
        const diffY = unit.position.y - this.position.y;
        return Math.hypot(diffX, diffY);
    }

    move(diffX, diffY, deltaTime) {
        // TODO: Add collision detection between units
        // TODO: Add pathfinding to move around obstacles
        // Move the unit in the direction of diffX and diffY
        const moveSpeed = this.stats.movement.speed;
        const distance = Math.hypot(diffX, diffY);
        const relativeSpeed = moveSpeed / distance;
        this.position.x += diffX * relativeSpeed * deltaTime;
        this.position.y += diffY * relativeSpeed * deltaTime;
    }

    attack(weapon) {
        // TODO: Check if the target modifier is always a 'change/passive'
        // TODO: Check if the target modifier is always based on classes
        // Weapon damage calculation
        // base damage + weapon modifiers - target armor = total damage
        const { damage: baseDamage, type: weaponType, modifiers } = weapon;
        let damage = baseDamage
        const targetClasses = new Set(this.target.stats.classes)
        const weaponModifier = modifiers.find(modifier => 
            // Check if modifier.target exists first
            modifier.target.class.every(targetClass => 
                targetClasses.has(targetClass)
            )
        );
        if (weaponModifier) {
            damage += weaponModifier.value;
        }
        const targetArmor = this.target.stats.armor.find(armor => armor.type === weaponType);
        if (targetArmor) {
            damage -= targetArmor.value;
        }
        // Damage can't be less than 1
        if (damage < 1) {
            damage = 1;
        }
        // Debug logging
        console.log('Dealt', damage, 'damage to', this.target.stats.name);
        this.target.takeDamage(damage);
    }

    takeDamage(damage) {
        this.stats.hitpoints -= damage;
        if (this.stats.hitpoints < 0) {
            this.dead = true;
            // Debug logging
            console.log(this.stats.name, 'died');
        }
    }
}

function placeUnitGroup(battlefield, x, side, units, height) {
    const direction = x < 0 ? -1 : 1;
    let y = Math.ceil(height / 2);
    // loop over all units types in the group
    for (const unitType of units) {
        // per unit type loop over each individual unit
        for (let unit = 0; unit < unitType.amount; unit++) {
            // if the y position is lower than -height/2, go to the top of the next column
            if (y < -height / 2 - 1) {
                y = Math.ceil(height / 2);
                x += direction;
            }
            // placement of the unit itself
            // remove amount from the unit, we will not need it, keep things clean
            const { amount, ...stats } = unitType;
            const unit = new Unit(x, y, side, stats);
            battlefield.push(unit);
            // go to next vertical position
            y--;
        }
    }
    // return the x position for the next group
    return x;
}

// This function edits battlefield in place and doesn't return anything
function placeArmy(battlefield, army, side) {
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
    x = placeUnitGroup(battlefield, x, side, units[0], heights[0]);
    // Offset the x position by 2 tiles to make room for the next group
    x += side * 2;
    x = placeUnitGroup(battlefield, x, side, units[1], heights[1]);
}

async function simulationLoop(battlefield, lastUpdateTime) {
    // Sleep for 100ms to reduce CPU usage
    try {
        await sleep(100);
    } catch (err) {
        console.error(err);
    }
    // Check the time passed since the last update
    const now = Date.now();
    const deltaTime = (now - lastUpdateTime) / 1000;
    // Loop over all units and update them
    // We update all the units 10 times per frame to speed up the simulation
    // I will update this to 100 if i manage to optimize the code a bit more
    const iterations = 10;
    for (let i = 0; i < iterations; i++) {
        for (const unit of battlefield) {
            unit.update(deltaTime, battlefield);
            // Exit from the loop if the simulation has ended
            if (!isSimulationRunning) {
                return;
            }
        }
    }
    return now;
}

// Look into using node-canvas to visualise the combat simulation
async function simulateCombat(armies) {
    const battlefield = [];
    // army1 will be placed in negative x direction, army2 in positive x direction
    placeArmy(battlefield, armies.army1, -1);
    placeArmy(battlefield, armies.army2, 1);
    // Start the loop with the battlefield and the current time
    let time = Date.now();
    while (isSimulationRunning) {
        time = await simulationLoop(battlefield, time);
    }
    return battlefield;
}

module.exports = {
    simulateCombat,
}
