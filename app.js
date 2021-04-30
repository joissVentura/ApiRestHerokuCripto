const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();
app.use(bodyParser.json());

// Credenciales mysql
const connection = mysql.createConnection({
  host: 'us-cdbr-east-03.cleardb.com',
  user: 'b21cddb959b45a',
  password: '6314b0d2',
  database: 'heroku_5edbdcae5318cee'
});
// mysql://b21cddb959b45a:6314b0d2@us-cdbr-east-03.clearddb.com/heroku_5edbdcae5318cee?reconnect=true
// Routing
app.get('/', (req, res) => {
  res.status(200).send('Its all good JS');
});

    // Obtener usuarios

app.get('/api/usuarios', (req, res) => {
  const sql = 'SELECT * FROM usuarios';

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.status(200).json(results);
    } else {
      res.send('Not result');
    }
  });
});

app.get('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM usuarios WHERE id = ${id}`;
  connection.query(sql, (error, result) => {
    if (error) console.log(error);

    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.send('No hay resultados');
    }
  });
});

app.post('/api/usuarios/add', (req, res) => {
  const sql = 'INSERT INTO usuarios SET ?';

  const customerObj = {
    username: req.body.username,
    pass: req.body.pass
  };
  if(customerObj.username != null & customerObj.pass != null){
    connection.query(sql, customerObj, error => {
      if (error) console.log(error);
      res.status(200).send('Usuario agregado.');
    });
  }else{
    res.status(500).send("Algunos campos están vacios")
  }
  
});

//  Connexion al mysql
connection.connect(error => {
  const errorEmited = error;
  try {
    
  } catch (error) {
    console.log(errorEmited)
  }
  console.log('Base de datos conectada y corriendo');
});

app.listen(PORT, () => console.log(`El servidor se está ejecutando en ${PORT}`));
