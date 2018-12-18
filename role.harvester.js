var roleBuilder = require('role.builder');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.carry.energy < creep.carryCapacity*0.75) {
            var sources = creep.room.find(FIND_SOURCES);
            if (/*index % 2*/creep.memory.index == 0) {
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                   if( creep.moveTo(sources[0])!=0)
                   {
                    creep.moveTo(sources[1]);
                    creep.memory.index = 0;
                   }
                }
            }
            else {
                if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    
                    if( creep.moveTo(sources[1])!=0)
                   {
                    creep.moveTo(sources[0]);
                    creep.memory.index = 1;
                   }
                }
            }
        }
        else {
            
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => s.energy < s.energyCapacity
            });

            // if we found one
            if (structure != undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
            }
            else{roleBuilder.run(creep);}
        }
    }
};

module.exports = roleHarvester;