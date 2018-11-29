const express = require('express');
const app = express();
const http = require('http').Server(app);

app.use(express.static(__dirname + '/assets'));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname })
});

app.listen(8000, () => {
  console.log('App listening on port 8000.')
});
