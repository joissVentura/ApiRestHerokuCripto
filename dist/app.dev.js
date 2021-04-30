"use strict";

var express = require('express');

var mysql = require('mysql');

var bodyParser = require('body-parser');

var PORT = process.env.PORT || 3050;
var app = express();
app.use(bodyParser.json()); // Credenciales mysql

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'distribuido',
  port: '3307'
}); // Routing

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
    if (error) throw error;

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
    user: req.body.user,
    password: req.body.password
  };

  if (customerObj.user != null & customerObj.password != null) {
    connection.query(sql, customerObj, function (error) {
      if (error) throw error;
      res.status(200).send('Usuario agregado.');
    });
  } else {
    res.status(500).send("Algunos campos están vacios");
  }
}); //  Connexion al mysql

connection.connect(function (error) {
  if (error) throw error;
  console.log('Base de datos conectada y corriendo');
});
app.listen(PORT, function () {
  return console.log("El servidor se est\xE1 ejecutando en ".concat(PORT));
});