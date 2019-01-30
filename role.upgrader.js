module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function (creep) {
        // if creep is bringing energy to the controller but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to the controller
        if (creep.memory.working == true) {
            // instead of upgraderController we could also use:
            // if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

            // try to upgrade the controller
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // if not in range, move towards the controller
                creep.moveTo(creep.room.controller);
            }
        }
        // if creep is supposed to get energy
        else {

            let useContainer = true;
            let useSource = true;
            /** @type {StructureContainer} */
            let container;
            // if the Creep should look for containers
            if (useContainer) {
                // find closest container
                container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                        s.store[RESOURCE_ENERGY] > 0
                });
                // if one was found
                if (container != undefined) {
                    // try to withdraw energy, if the container is not in range
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(container);
                    }
                }
            }
            // if no container was found and the Creep should look for Sources
            if (container == undefined && useSource) {
                // find closest source
                //var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                var sources = creep.room.find(FIND_SOURCES);
                // try to harvest energy, if the source is not in range
                
                    // move towards it
                    if (/*index % 2*/creep.memory.index == 0) {
                        if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[1]) != 0;
                        }
                    }
                    else {
                        if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {

                            creep.moveTo(sources[1]) != 0;
                        }
                    }
                
            }

        }
    }
};

