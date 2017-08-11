const express = require('express');
const mongo = require('mongodb').MongoClient;
const path = require('path');

const dbUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/urlshortener';
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/new/:url', function(req, res) {
  // if url is malformed return
  // {"error":"Wrong url format, make sure you have a valid protocol and real site."}

  // otherwise add to the database and return
  // { "original_url":"http://foo.com:80", "short_url":"https://little-url.herokuapp.com/8170" }

  res.end();
});

app.get('/:url', function(req, res) {
  // check if url is in the database - if not: return
  // {"error":"This url is not on the database."}

  // otherwise redirect to the url stored in the database;

  res.end();
})

app.listen(port, function () {
  console.log('app listening on port', port);
});
