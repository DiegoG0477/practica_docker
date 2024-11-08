const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  port: 3306
};

// Función para manejar la conexión con reintentos
function connectWithRetry() {
  const db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      console.error('Error conectando a la base de datos:', err);
      // Reintenta la conexión después de 5 segundos si falla
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Conectado a la base de datos MySQL');
    }
  });

  // Manejo de errores en la conexión
  db.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Conexión a MySQL perdida. Reintentando...');
      connectWithRetry();
    } else {
      throw err;
    }
  });

  return db;
}

// Crea la conexión de base de datos con reintento
const db = connectWithRetry();

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error en la consulta de login:', err);
      res.status(500).json({ success: false, message: 'Error en el servidor' });
    } else if (results.length > 0) {
      res.json({ success: true, message: 'Login exitoso!' });
    } else {
      res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend escuchando en el puerto ${PORT}`);
});
