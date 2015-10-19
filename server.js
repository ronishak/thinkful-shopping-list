var express = require('express');
var bodyParser = require('body-parser');

var Storage = function() {
  this.items = [];
  this.id = 0;
};

Storage.prototype.add = function(name) {
  var item = {name: name, id: this.id};
  this.items.push(item);
  this.id += 1;
  return item;
};

Storage.prototype.delete = function(id) {
  var item;
  for (var i = 0; i < this.items.length; i++) {
    if (this.items[i].id == id) {
      item = this.items[i];
      this.items.splice(i,1);
      break;
    }
  }
  return item;
};

Storage.prototype.edit = function(name, id) {
  var item = {name: name, id: id};
  for (var i = 0; i < this.items.length; i++) {
    if (this.items[i].id == id) {
      this.items[i].name = name;
      break;
    }
  }
  return item;
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

var jsonParser = bodyParser.json();

app.get('/items', function(req, res) {
  res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }

  var item = storage.add(req.body.name);
  res.status(201).json(item);
});

app.put('/items/:id', jsonParser, function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }
  var name = req.body.name;
  var id = req.body.id;
  var item = storage.edit(name, id);
  res.status(200).json(item);
});

app.delete('/items/:id', function(req, res) {
  var id = req.params.id;
  var item = storage.delete(id);
  if (!item) {
    res.status(404);
  } else {
    res.status(200).json(item);
  }
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

exports.app = app;
exports.storage = storage;
