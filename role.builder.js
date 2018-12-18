var roleUpgrader = require('role.upgrader');

module.exports = {
    // a function to run the logic for this role
    run: function (creep) {
        // if creep is trying to complete a constructionSite but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy > creep.carryCapacity * 0.75) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to complete a constructionSite
        if (creep.memory.working == true) {
            // find closest constructionSite
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            // var constructionSite =  Game.creeps[0].pos.findClosestByPath(FIND_STRUCTURES, {filter: s => (s.structureType == STRUCTURE_EXTENSION )       });
            // if one is found
            if (constructionSite != undefined) {
                //console.log( "HOLA");
                // try to build, if the constructionSite is not in range
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    // move towards the constructionSite
                    creep.moveTo(constructionSite);
                }
            }
            // if no constructionSite is found
            else {
                // go upgrading the controller
                roleUpgrader.run(creep);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            // find closest source
            var sources = creep.room.find(FIND_SOURCES);
            // try to harvest energy, if the source is not in range
            if (/*index % 2*/creep.memory.index == 0) {
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    if (creep.moveTo(sources[0]) != 0) {
                        creep.moveTo(sources[1]);
                        creep.memory.index = 0;
                    }
                }
            }
            else {
                if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {

                    if (creep.moveTo(sources[1]) != 0) {
                        creep.moveTo(sources[0]);
                        creep.memory.index = 1;
                    }
                }
            }

        }
    }
};