var _ = require('lodash');
var bcrypt = require('bcryptjs');
var Q = require('q');
var JsonDB = require('node-json-db');
var db = new JsonDB("./routes/database/users", true, true);

module.exports.authenticate = function (username, password) {
    var deferred = Q.defer();

    try {
        var usr = db.getData("/" + username);
        if (bcrypt.compareSync(password, usr.hash)) {
            deferred.resolve({name:usr.firstName +' '+usr.lastName,username:username,token: bcrypt.hashSync(username, 10)});
        } else {
            deferred.resolve();
        }

    } catch (error) {
        deferred.resolve();
    }
    return deferred.promise;
};
//module.exports.getById = function (_id) {
//    var deferred = Q.defer();
//    var user = null;
//    users.forEach(function (usr) {
//        if (usr.username === _id) {
//            user = usr;
//        }
//    });
//    if (user) {
//        deferred.resolve(_.omit(user, 'hash'));
//    } else {
//        // user not found
//        deferred.resolve();
//    }
//    return deferred.promise;
//};
module.exports.create = function (userParam) {
    var deferred = Q.defer();

    try {
        var usr = db.getData("/" + userParam.username);
        deferred.reject('Username "' + userParam.username + '" is already taken');
    } catch (error) {
        var user = _.omit(userParam, 'password'), username = userParam.username;
        user = _.omit(user, 'username');
        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);
        db.push('/' + username, user);
        deferred.resolve();
    }

    return deferred.promise;
};
module.exports.update = function (_id, userParam) {
    var deferred = Q.defer();
    
    try {
        var user = db.getData("/" + _id);
        user.firstName = userParam.firstName;
        user.lastName = userParam.lastName;
        user.hash = bcrypt.hashSync(userParam.password, 10);
        db.push("/" + _id,user);
        
        deferred.resolve(_.omit(user, 'hash'));

    } catch (error) {
        // invalid user
        deferred.reject('You can update only your data');
    }

    return deferred.promise;
};
module.exports.delete = function (_id) {
    var deferred = Q.defer();
   try {
        db.delete("/" + _id);
        deferred.resolve();

    } catch (error) {
        // invalid user
        deferred.reject('You can delete only your data');
    }

    return deferred.promise;
};
