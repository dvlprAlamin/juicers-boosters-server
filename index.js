const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vsgsy.mongodb.net/juicerBoosters?retryWrites=true&w=majority`;

const app = express();
app.use(express.json());
app.use(cors());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const juiceCollection = client.db("juicerBoosters").collection("juices");
  app.post('/addJuice',(req,res)=> {
      juiceCollection.insertOne(req.body)
      .then(result => {
          res.send(result.insertedCount > 0)
          // console.log(result.insertedCount);
      })
      // console.log(req.body);
  })
  app.get('/juices',(req,res)=> {
      juiceCollection.find({})
      .toArray((error, documents)=> {
          res.send(documents)
      })
  })
  app.get('/juices/:id',(req,res)=> {
    //   console.log(req.params.id);
      juiceCollection.find({_id:ObjectId(req.params.id)})
      .toArray((error, documents)=> {
          res.send(documents)
      })
  })
  app.delete('/delete/:id', (req,res)=> {
    juiceCollection.findOneAndDelete({_id:ObjectId(req.params.id)})
    .then(response => {
      res.send(response.ok > 0);
    })
  })
//   client.close();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const port = 4000;
app.listen(process.env.PORT || port);