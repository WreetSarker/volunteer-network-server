const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();
const ObjectID = require('mongodb').ObjectID;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.enmmk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const eventCollection = client.db("volunteer").collection("events");
    const personalEvents = client.db("volunteer").collection("personalEvents");

    app.get('/events', (req, res) => {
        eventCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })

    })

    app.get('/getPersonalEvents', (req, res) => {
        personalEvents.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents)
            })

    })

    app.post('/addEvent', (req, res) => {
        const newEvent = req.body;
        console.log('new event', newEvent);
        eventCollection.insertOne(newEvent)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/personalEvent', (req, res) => {
        const newPersonalEvent = req.body;
        personalEvents.insertOne(newPersonalEvent)
            .then(result => {
                res.send(result.insertedCount > 1)
            })
    })

    app.delete('deleteEvent/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        personalEvents.findOneAndDelete({ _id: id })
            .then(documents => res.send(!!documents.value))
    })

});





app.get('/', (req, res) => {
    res.send('Hello from server')
})

app.listen(process.env.PORT || 4000);