const express = require('express');
// const dotenv = require('dotenv').config({path:'../.env'});
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5001;

// Connexion à MongoDB
const connectDB = require('./config/database');
connectDB();

// Initialisation d'Express
const app = express();

// Acecepter les données envoyées par formulaire
// TODO
app.use(express.json());
app.use(express.urlencoded())

// Routes
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/lines', require('./routes/lineRoutes'));
app.use('/api/stops', require('./routes/stopRoutes'));
app.use('/api/stats', require('./routes/statRoutes'));

// Lancement du serveur
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
  // console.log(`Serveur démarré sur le port ${port}`);
  // console.log(`MONGO_URI : ${process.env.MONGO_URI}`);
  // console.log(`JWT_SECRET : ${process.env.JWT_SECRET}`);
});