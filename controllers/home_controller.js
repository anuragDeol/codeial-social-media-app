module.exports.home = function(req, res){
    return res.end('<h1>Express is up for Codeial</h1>')
}

module.exports.actionName = function(req, res){
    return res.end(`<h1 style="display:inline">This is what you(user) requested for- </h1> ${req.url}`);
}

module.exports.playground = function(req, res){
    return res.end('<h1>Hello Ninja, welcome to the playground</h1>');
}

module.exports.hi = function(req, res){
    return res.end('<h1>Hi!!</h1>');
}