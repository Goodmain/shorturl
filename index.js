require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');
const { URL } = require('url');
const urls = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: 'false' }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app
  .route('/api/shorturl/:id?')
  .get((req, res) => {
    if (urls[+req.params.id] !== undefined) {
      res.redirect(urls[+req.params.id]);
    } else {
      res.json({ error: 'invalid url' });
    }
  }).post((req, res) => {
    try {
      const url = new URL(req.body.url)

      dns.lookup(url.hostname, (error) => {
        if (error) {
          res.json({ error: 'invalid url' });
        } else {
          urls.push(url);
          res.json({
            original_url: url,
            short_url: urls.length - 1
          });
        }
      });
    } catch(err) {
      res.json({ error: 'invalid url' });
    }
  });

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
