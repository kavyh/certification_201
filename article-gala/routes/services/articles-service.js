var JsonDB = require('node-json-db'),sequenceName='articleIdsequence';
var sequenceId = '/'+sequenceName;
var Q = require('q');
var articlesDb = new JsonDB("./routes/database/articles", true, true);
var _ = require('lodash');

try {
    articlesDb.getData(sequenceId);
} catch (error) {
    articlesDb.push(sequenceId, 1);
}

module.exports.create = function (bodyParam) {
    var deferred = Q.defer();

    try {
        var sequence = articlesDb.getData(sequenceId);
        bodyParam['date'] = Date.now();
        bodyParam['author'] = _.omit(bodyParam['author'], "token");
        bodyParam['comments'] = [];
        articlesDb.push('/' + sequence++, bodyParam);
        //update the sequence in DB
        articlesDb.push(sequenceId, sequence);
var newArticle = articlesDb.getData("/"+(sequence-1));
newArticle['articleId'] = (sequence-1);
        deferred.resolve(newArticle);
    } catch (error) {
        deferred.reject(error);
    }

    return deferred.promise;
};
module.exports.update = function (bodyParam) {
    var deferred = Q.defer();

    try {
        bodyParam.data['date'] = Date.now();
        bodyParam = _.omit(bodyParam, "articleId");
        articlesDb.push('/'+bodyParam.id , bodyParam.data);

        deferred.resolve(bodyParam.id);
    } catch (error) {
        deferred.reject(error);
    }

    return deferred.promise;
};
module.exports.getAllTheArticles = function () {
    var deferred = Q.defer();

    try {
        var data = articlesDb.getData("/");
        data = _.omit(data, sequenceName);
        _.forEach(data, function (value) {
            value = _.omit(value, "description");
            value = _.omit(value, "comments");
        });

        deferred.resolve(data);
    } catch (error) {
        deferred.reject(error);
    }

    return deferred.promise;
};
module.exports.delete = function (id) {
    var deferred = Q.defer();

    try {
        articlesDb.delete("/"+id);

        deferred.resolve(true);
    } catch (error) {
        deferred.reject(error);
    }

    return deferred.promise;
};
module.exports.getArticle = function (id) {
    var deferred = Q.defer();

    try {
        var data = articlesDb.getData("/"+id);

        deferred.resolve(data);
    } catch (error) {
        deferred.reject(error);
    }

    return deferred.promise;
};
module.exports.createComment = function (bodyParam) {
    var deferred = Q.defer();

    try {
        bodyParam.data['date'] = Date.now();
        articlesDb.push('/'+bodyParam.id +'/comments[]', bodyParam.data,true);

        deferred.resolve(bodyParam.id);
    } catch (error) {
        deferred.reject(error);
    }

    return deferred.promise;
};
