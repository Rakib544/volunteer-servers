const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json())
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.acxxo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('Hello I am now working on volunteer network page')
})

client.connect(err => {
  const eventCollections = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  const registeredCollections = client.db(`${process.env.DB_NAME}`).collection('registeredUser');

  app.post('/addEvent', (req, res) => {
      const eventData = req.body;
      eventCollections.insertOne(eventData)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

  app.get('/events', (req, res) => {
      eventCollections.find({})
      .toArray((err, events) => {
          res.send(events)
      })
  })

  app.post('/addRegisteredUser', (req, res) => {
    registeredCollections.insertOne(req.body)
    .then(result => res.send(result.insertedCount > 0) )
  })

  app.get('/registeredUsers', (req, res) => {
      registeredCollections.find({})
      .toArray((err, users) => {
          res.send(users)
      })
  })
});


app.listen(process.env.PORT || 8080);