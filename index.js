const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cfenv = require('cfenv');

// Set up express app.
const app = express();
app.use(bodyParser.json({
    type: () => {
        return true;
    }
}))
app.listen(process.env.PORT || 5000);

// Utility method to obtain CosmoDB credentials from CF user-provided service.
getCreds = () => {
    var appEnv = cfenv.getAppEnv();
    var credentials = appEnv.getServices().COSMO_DB_SERVICE.credentials;
    return `mongodb://${credentials.user}:${credentials.password}@${credentials.user}.documents.azure.com:${credentials.port}/?ssl=true`;
}

// Method to insert documents.
insertDocuments = (db, collection, docs, callback) => {
    try {
        const coll = db.collection(collection);
        coll.insertMany(docs, function (err, result) {
            callback(err, result);
        });
    }
    catch (err) {
        callback(err);
    }
}

// Instantiate MongoClient.
const url = getCreds();
const client = new MongoClient(url);

// Default GET route.
app.get('/', (req, res) => {
    res.json({ message: 'This is a test using Node.js and Cosmo DB' })
});

// POST route to save docs.
app.post('/save/:db/:collection', (req, res) => {

    const dbName = req.params.db;
    const collectionName = req.params.collection;

    client.connect(function (err) {
        if (!err) {
            const db = client.db(dbName);
            insertDocuments(db, collectionName, req.body, (err, result) => {
                if (!err) {
                    res.json(result);
                }
                else {
                    res.json({ error: err.message });
                }
                client.close();
            });
        }
        else {
            res.json({ error: `Could not connect: ${err.message}` });
        }
    });
});

app.put('/', (req, res) => {
    res.json({ message: 'This method is not yet implemented' })
});

app.delete('/', (req, res) => {
    res.json({ message: 'This method is not yet implemented' })
});