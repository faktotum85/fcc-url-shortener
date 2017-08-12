const express = require('express');
const mongo = require('mongodb').MongoClient;
const path = require('path');

const dbUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/urlshortener';
const port = process.env.PORT || 8080;
const app = express();

let urlCount;
let db;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/new/:url(*)', function(req, res) {
  // test validity of the url;
  const url = req.params.url;
  // Copyright (c) 2010-2013 Diego Perini (http://www.iport.it), MIT licensed
  // https://gist.github.com/dperini/729294
  const valid = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( url );

  if (valid) {
    urlCount++;
    const hostName = (req.headers.host === 'localhost:5000' ? '' : 'https://') + req.headers.host;
    // add to the database and return info
    db.collection('urls').insert({
      original_url: url,
      short_url: hostName + '/' + urlCount.toString(36)
    }, function(err, data) {
      if (err) {
        console.error(err);
        res.end();
      } else {
        console.log(data);
        res.json({
          original_url: data.ops[0].original_url,
          short_url: data.ops[0].short_url
        });
      }
    });
  } else {
    // url is malformed
    res.json({error:'Wrong url format, make sure you have a valid protocol and real site.'});
  }
});

app.get('/:url(*)', function(req, res) {
  // check if url is in the database..
  const hostName = (req.headers.host === 'localhost:5000' ? '' : 'https://') + req.headers.host;
  db.collection('urls').findOne({
    short_url: hostName + '/' + req.params.url
  }, function (err, data) {
    if (err) {
      console.error(err);
    } else {
      if (data === null) {
        res.status(200).json({error:'This url is not on the database.'});
      }
      else {
        // ...and redirect to the url stored in the database;
        console.log(data);
        res.redirect(data.original_url);
      }
    }
  });
});

mongo.connect(dbUrl, function(err, connection) {
  if (err) throw err;
  db = connection;

  // caching urlCount
  db.collection('urls').count({}, function(err, count) {
    if (err) throw err;
    console.log(count);
    urlCount = count;

    app.listen(port, function () {
      console.log('app listening on port', port);
    });
  });
});
