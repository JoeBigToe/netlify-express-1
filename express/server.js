'use strict';
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://ps-user:Qs1.2011@houses-cluster-rhxbl.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });

var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');

const router = express.Router();

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Personalized message!</h1>');
  res.end();
});

router.get('/another', (req, res) => res.json({ route: req.originalUrl }));

router.get('/house/:quantity', (req, res, next) => {
  
  var list = [];
  var quantity = parseInt(req.params.quantity, 10);

  client.connect( err => {
    assert.equal(null, err);

    var collection = client.db("test").collection("houses");
    var houses = collection.find({}).sort({"Modified": -1.0}).limit(quantity); 

    houses.forEach( (doc,err) => {
      assert.equal(null, err);
      list.push(doc);
    }, () => {
      res.json(list);
    }); 
    
  });

});

router.put('/house/:id', (req, res) => {

  client.connect( err => {
    assert.equal(null, err);

    var collection = client.db("test").collection("houses");

    var query = { _id: ObjectId(req.params.id)};
    var newValue = { $set: { NewAd: 0 } };

    collection.updateOne( query, newValue, (err, res) => {
      assert.equal(null, err);
      console.log("1 record updated successfully!");
    });
    
  });
  
  // res.end();
  res.json([]);

});

router.put('/delete/:id', (req, res) => {

  var query = { _id : ObjectId(req.params.id)};
  console.log("Requested the deletion of document with id: " + req.params.id);
  
  client.connect( err => {
    assert.equal(null, err);
    
    var collectionFrom = client.db("test").collection("houses");
    var collectionTo = client.db("test").collection("old-houses");
    
    collectionFrom.findOne( query , (err, res) => {
      assert.equal(null, err);
      console.log("1 document found");

      collectionTo.insertOne( res, (err, res) => {
        assert.equal(null, err);        
        console.log("Result of insertion: " + res.result.ok);
        
        collectionFrom.deleteOne( query, (err, res) => { 
          assert.equal(null, err); 
          console.log("Result of the deletion: " + res.result.ok);
        });      
      });
    });     
  });
  
  // res.end();
  res.json([]);

});


app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);



