const { MongoClient, ObjectID } = require('mongodb');

const dbName = 'TodoApp';
var db;

MongoClient.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true
}, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    db = client.db(dbName);

    // db.collection('Todos').find().count().then((docs) => {
    //     console.log(JSON.stringify(docs,undefined,2));
    // }, (err) => {
    //     return console.log('Unable to fetch documents', err);
    // });

    // db.collection('Users').deleteMany({name: 'Raj'}).then((result) => {
    //     console.log(result);
        
    // })

    db.collection('Users').findOneAndDelete({_id: new ObjectID("5c7e5953ad16a34752260fdc")}).then((result) => {
        console.log(result);
        
    })

    client.close();
});