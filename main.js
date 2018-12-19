// import modules
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
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
    var percentageOfHarvesters = 50;
    var percentageOfrepairer = 10;
    var percentageOfUpgraders = 20;
    var percentageOfBuilders = 20;
    var numberOfCreeps = _.sum(Game.creeps, (c) => c != undefined)
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfupgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfbuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfrepairer = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');

    var index = 0
    // for every creep name in Game.creeps
    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];
        if (numberOfCreeps > 5) {
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
    if (numberOfCreeps < 20 || Game.spawns.Spawn1.room.energyAvailable == Game.spawns.Spawn1.room.energyCapacityAvailable) {
        if (numberOfHarvesters < (numberOfCreeps * percentageOfHarvesters / 100)) {
            name = Game.spawns.Spawn1.createCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], undefined,
                { role: 'harvester', working: false, index: 0 });
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
        else {
            name = Game.spawns.Spawn1.createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE], undefined,
                { role: 'builder', working: false, index: 0 });
            console.log("builder");
        }


        if (!(name < 0)) {
            console.log("Spawned new creep: " + name);
        }
    }
};