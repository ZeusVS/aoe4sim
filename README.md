### Age of Empires 4 Combat Simulator
This is a practice project for the boot.dev course

If anyone has hint/tip/idea how to improve the realism of the combat simulation
please feel free to contact me or issue a PR

#### Details about the combat simulation
The civs, unit selection and their stats will be accessed from aoe4world, this will 
ensure we are always up to date and don't have to rewrite code every game update.

##### Steps of the simulation:
    - The user selects the civ, unit(s) and their amounts of each of the two players
    - The army gets placed on a grid
    - The combat between the two armies is simulated to decide a winner
    - A detailed log with details of the simulation gets printed

##### Stats used for the combat simulation
    - unit class
    - hitpoints
    - damage
    - attack speed
    - attack range
    - unit counters (weapon targets)
    - armor
    - movement speed

##### Stats NOT used for the combat simulation
    - abilities
    - influences
    - unit dimensions
    - line of sight

#### Details about placement of units on the grid
- Army one is placed in negative x direction and army two is placed in positive x direction
- Units are first placed within their respective group:
    - Melee
    - Ranged
- Then each group is placed in a grid that is twice as high as it is wide
- The order of units placement is the same as the user's input order
    - Melee units are placed one tile away from the "mirror plane"
    - Ranged units are placed one tile away from the last melee unit

#### TODO before program is actually accurate
    - Debugging
    - Adding collision to unit movement

#### Features to possibly implement later
    - Siege units
    - Religion units
    - Add technologies
    - Add different body dimensions for different unit types (cavalry vs infantry, etc.)
