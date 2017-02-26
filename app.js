var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/myproject';

MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    insertDocuments(db, function () {
        updateDocument(db, function () {
            db.close();
        });
    });
});

var insertDocuments = function (db, callback) {
    var collection = db.collection('documents');
    collection.insertMany([
        { a: 1 }, { a: 2 }, { a: 3 }
    ], function (err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log('Insert 3 documents into the collection');
        callback(result);
    });
};

var findDocuments = function (filter, db, callback) {
    var collection = db.collection('documents');
    collection.find(filter).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
    });
};

var updateDocument = function (db, callback) {
    var collection = db.collection('documents');
    collection.updateOne({ a: 2 }, { $set: { b: 1 } }, function (err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Updated the document with the field a equal to 2");
        callback(result);
    })
};

var indexCollection = function(db, callback) {
    db.collection('documents').createIndex({'a': 1}, null, function(err, results) {
        console.log(results);
        callback();
    })
}