'use strict';
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://ps-user:Qs1.2011@houses-cluster-rhxbl.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });

var assert = require('assert');

const router = express.Router();

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Personalized message!</h1>');
  res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.get('/house', (req, res) => {
  
  var quantity = parseInt(req.param('quantity'), 10);

  client.connect( err => {
    assert.equal(null, err);

    var list = [];
    var collection = client.db("test").collection("houses");
    var houses = collection.find({}).sort({"modified": -1.0}).limit(quantity); 

    houses.forEach( (doc,err) => {
      assert.equal(null, err);
      list.push(doc);
    }, () => {
      client.close();
      res.json(list);
    }); 
    
  });

});

router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);



