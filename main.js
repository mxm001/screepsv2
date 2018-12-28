// import modules
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallRepairer');
var roleMiner = require('role.miner');
require('prototype.tower');

module.exports.loop = function () {
	// check for memory entries of died creeps by iterating over Memory.creeps
	for (let name in Memory.creeps) {
		// and checking if the creep is still alive
		if (Game.creeps[name] == undefined) {
			// if not, delete the memory entry
			delete Memory.creeps[name];
		}
	}

	var percentageOfHarvesters = 40;
	//	var percentageOfMiners = 20;
	var percentageOfrepairer = 10;
	var percentageOfUpgraders = 20;
	var percentageOfBuilders = 20;
	var percentageOfWallrepairer = 10;
	var numberOfCreeps = _.sum(Game.creeps, (c) => c != undefined)
	var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
	var numberOfupgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
	var numberOfbuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
	var numberOfrepairer = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
	var numberOfwallrepairer = _.sum(Game.creeps, (c) => c.memory.role == 'wallRepairer');
	var numberOfMiners = _.sum(Game.creeps, (c) => c.memory.role == 'miner');
	var index = 0
	// for every creep name in Game.creeps
	for (let name in Game.creeps) {
		// get the creep object
		var creep = Game.creeps[name];
		creep.say(creep.memory.role);
		if (numberOfCreeps > 15) {
			switch (creep.memory.role) {
				case 'harvester':
					roleHarvester.run(creep);
					//roleBuilder.run(creep, index);
					break;
				case 'upgrader':
					//roleHarvester.run(creep, index);
					roleUpgrader.run(creep);
					//roleBuilder.run(creep,index);
					break;
				case 'builder':
					// roleHarvester.run(creep, index);
					roleBuilder.run(creep);
					break;
				case 'repairer':
					//roleBuilder.run(creep, index);
					roleRepairer.run(creep);
					//roleHarvester.run(creep, index);
					break;
				case 'wallRepairer':
					//roleBuilder.run(creep, index);
					roleWallRepairer.run(creep);
					//roleHarvester.run(creep, index);
					break;
				case 'miner':
					//roleBuilder.run(creep, index);
					roleMiner.run(creep);
					//roleHarvester.run(creep, index);
					break;
			}
		}
		else {
			roleHarvester.run(creep);
		}

		index++;

	}

	var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
	// for each tower
	for (let tower of towers) {
		// run tower logic
		tower.defend();
	}

	console.log("Total:" + numberOfCreeps);
	// console.log("harvester:" + numberOfHarvesters);
	// console.log("upgrader:" + numberOfupgraders);
	// console.log("builder:" + numberOfbuilders);
	// console.log("repairer:" + numberOfrepairer);
	var name = undefined;

	//Game.spawns.Spawn1.room.energyAvailable
	//Game.spawns.Spawn1.room.energyCapacityAvailable 
	//var energy = Game.creeps['Blake'].pos.findInRange(             FIND_DROPPED_RESOURCES,             1         );
	/*MOVE	50	Decreases fatigue by 2 points per tick.
WORK	100	Harvests 2 energy units from a source per tick.
Harvests 1 mineral unit from a deposit per tick.
Builds a structure for 5 energy units per tick.
Repairs a structure for 100 hits per tick consuming 1 energy unit per tick.
Dismantles a structure for 50 hits per tick returning 0.25 energy unit per tick.
Upgrades a controller for 1 energy unit per tick.

CARRY	50	Can contain up to 50 resource units.
ATTACK	80	Attacks another creep/structure with 30 hits per tick in a short-ranged attack.
RANGED_ATTACK	150	
Attacks another single creep/structure with 10 hits per tick in a long-range attack up to 3 squares long.

Attacks all hostile creeps/structures within 3 squares range with 1-4-10 hits (depending on the range).

HEAL	250	Heals self or another creep restoring 12 hits per tick in short range or 4 hits per tick at a distance.
CLAIM	600	
Claims a neutral room controller.

Reserves a neutral room controller for 1 tick per body part.

Attacks a hostile room controller downgrading its timer by 300 ticks per body parts.

Attacks a neutral room controller reservation timer by 1 tick per body parts.

A creep with this body part will have a reduced life time of 600 ticks and cannot be renewed.

TOUGH	10	No effect, just additional hit points to the creep's body. Can be boosted to resist damage.*/
	workVal = 100;
	moveVal = 50;
	carryVal = 50;
	attackVal = 80;
	rangedAttackVal = 150;
	healVal = 250;
	claimVal = 600;
	toughVal = 10;//Siempre usar al principio del array
	energia = Game.spawns.Spawn1.room.energyAvailable;
	//energia=Game.spawns.Spawn1.room.energyCapacityAvailable;

	if (numberOfCreeps > 20 && energia > Game.spawns.Spawn1.room.energyCapacityAvailable * 0.75) {
		if (numberOfHarvesters < (numberOfCreeps * percentageOfHarvesters / 100)) {
			let movepiecesporc = 40 / 100;
			let workpiecesporc = 20 / 100;
			let carrypiecesporc = 40 / 100;

			bodyParts = [];
			for (let index = 0; index < Math.floor(workpiecesporc * energia / workVal); index++) {
				bodyParts.push(WORK);
			}

			for (let index = 0; index < Math.floor(carrypiecesporc * energia / carryVal); index++) {
				bodyParts.push(CARRY);
			}
			for (let index = 0; index < Math.floor(movepiecesporc * energia / moveVal); index++) {
				bodyParts.push(MOVE);
			}

			name = Game.spawns.Spawn1.createCreep(bodyParts, undefined, { role: 'harvester', working: false, index: 0 });
			//console.log(name);
			console.log("harvester");
		}
		else if (numberOfupgraders < (numberOfCreeps * percentageOfUpgraders / 100)) {

			name = Game.spawns.Spawn1.createCreep([WORK, WORK, WORK, MOVE, MOVE, CARRY, CARRY, MOVE], undefined,
				{ role: 'upgrader', working: false, index: 0 });
			console.log("upgrader");
		}
		else if (numberOfrepairer < (numberOfCreeps * percentageOfrepairer / 100)) {

			name = Game.spawns.Spawn1.createCreep([WORK, WORK, WORK, MOVE, MOVE, CARRY, CARRY, MOVE], undefined, { role: 'repairer', working: false, index: index % 2 });
			console.log("repairer");
		}
		else if (numberOfwallrepairer < (numberOfCreeps * percentageOfWallrepairer / 100)) {

			name = Game.spawns.Spawn1.createCreep([WORK, WORK, WORK, WORK, MOVE, CARRY, MOVE], undefined, { role: 'wallRepairer', working: false, index: index % 2 });
			console.log("wallRepairer");
		}
		//else if (numberOfMiners < (numberOfCreeps * percentageOfMiners / 100)) {

		//	name = Game.spawns.Spawn1.createCreep([WORK, WORK, WORK, WORK, WORK, MOVE], undefined,
		//		{ role: 'miner', working: false, index: 0 });
		//	console.log("miner");
	}
	else {
		if (energia > Game.spawns.Spawn1.room.energyCapacityAvailable * 0.75) {
			let movepiecesporc = 40 / 100;
			let workpiecesporc = 20 / 100;
			let carrypiecesporc = 40 / 100;
			//console.log("HOLA");
			bodyParts = [];
			for (let index = 0; index < Math.floor(workpiecesporc * energia / workVal); index++) {
				bodyParts.push(WORK);
			}

			for (let index = 0; index < Math.floor(carrypiecesporc * energia / carryVal); index++) {
				bodyParts.push(CARRY);
			}
			for (let index = 0; index < Math.floor(movepiecesporc * energia / moveVal); index++) {
				bodyParts.push(MOVE);
			}
			name = Game.spawns.Spawn1.createCreep(bodyParts, undefined, { role: 'harvester', working: false, index: 0 });
			console.log("harvester");
		}
	}

	if (!(name < 0)) {
		console.log("Spawned new creep: " + name);
	}

};