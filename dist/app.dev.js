"use strict";

var express = require('express');

var mysql = require('mysql');

var bodyParser = require('body-parser');

var PORT = process.env.PORT || 3050;
var app = express();
app.use(bodyParser.json()); // Credenciales mysql

/* const connection = mysql.createConnection({
  host: 'us-cdbr-east-03.cleardb.com',
  user: 'b21cddb959b45a',
  password: '6314b0d2',
  database: 'heroku_5edbdcae5318cee'
}); */

var connection; // mysql://b21cddb959b45a:6314b0d2@us-cdbr-east-03.clearddb.com/heroku_5edbdcae5318cee?reconnect=true
// Routing

app.get('/', function (req, res) {
  res.status(200).send('Its all good JS');
}); // Obtener usuarios

app.get('/api/usuarios', function (req, res) {
  var sql = 'SELECT * FROM usuarios';
  connection.query(sql, function (error, results) {
    if (error) throw error;

    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.send('Not result');
    }
  });
});
app.get('/api/usuarios/:id', function (req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM usuarios WHERE id = ".concat(id);
  connection.query(sql, function (error, result) {
    if (error) console.log(error);

    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.send('No hay resultados');
    }
  });
});
app.post('/api/usuarios/add', function (req, res) {
  var sql = 'INSERT INTO usuarios SET ?';
  var customerObj = {
    username: req.body.username,
    pass: req.body.pass
  };

  if (customerObj.username != null & customerObj.pass != null) {
    connection.query(sql, customerObj, function (error) {
      if (error) console.log(error);
      res.status(200).send('Usuario agregado.');
    });
  } else {
    res.status(500).send("Algunos campos están vacios");
  }
}); //  Connexion al mysql

var handleDisconnect = function handleDisconnect() {
  connection = mysql.createConnection({
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'b21cddb959b45a',
    password: '6314b0d2',
    database: 'heroku_5edbdcae5318cee'
  }); // Recrea la conexion

  connection.connect(function (err) {
    if (err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 1000);
    }
  });
  connection.on('error', function (err) {
    console.log('db error', err);

    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
};

try {
  handleDisconnect();
} catch (error) {
  console.log("-----------------------------------------------" + error);
}

app.listen(PORT, function () {
  return console.log("El servidor se est\xE1 ejecutando en ".concat(PORT));
});