const kue = require('kue');

const queue = kue.createQueue();

queue.on('error', function(err){
    console.log("error in setting up kue: ", err);
});


module.exports = queue;