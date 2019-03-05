//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
// var obj = new ObjectID();
// console.log(obj);
// console.log(obj.generationTime);
// console.log(obj.getTimestamp());


const dbName = 'TodoApp';
var db;

MongoClient.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true
}, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    db = client.db(dbName);

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // },(err, result) => {
    //     if(err){
    //         return console.log('Unable to insert record');
    //     }
    //     console.log(result.ops);
    // });

    // db.collection('Users').insertOne({
    //     name: 'Jinendra',
    //     age: 20,
    //     location: 'Rajkot'
    // },(err, result) => {
    //     if(err){
    //         return console.log('Unable to insert record');
    //     }
    //     console.log(result.ops);
    // });

    client.close();
});