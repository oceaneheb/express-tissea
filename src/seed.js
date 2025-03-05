const mongoose = require('mongoose');
// const faker = require('faker');
require('dotenv').config();

const UserModel = require('./models/userModel');
const CategoryModel = require('./models/categoryModel');
const LineModel = require('./models/lineModel');
const StopModel = require('./models/stopModel');

async function seedDatabase() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        // await mongoose.connect(process.env.MONGO_URI);

        console.log('Connexion à MongoDB réussie');

        // Supprimer les données existantes
        await UserModel.deleteMany({});
        await CategoryModel.deleteMany({});
        await LineModel.deleteMany({});
        await StopModel.deleteMany({});

        console.log('Données précédentes supprimées');

        // Générer un tableau de données "Utilisateur"
        const users = [
            {
                username: "laurie41",
                email: "laurie41@gmail.com",
                password: "12345"
            },
            {
                username: "max21",
                email: "max21@gmail.com",
                password: "12345"
            }
        ];

        // Créer les catégories et récupérer leurs ID
        const createdCategories = await CategoryModel.create([
            { name: "bus" },
            { name: "metro" },
            { name: "tram" }
        ]);

        // Générer un tableau de données "Ligne"
        const lines = await LineModel.create([
            {
                name: "L1",
                categoryType: createdCategories[0]._id, // bus
                startTime: "05:30",
                endTime: "23:30"
            },
            {
                name: "Ligne A",
                categoryType: createdCategories[1]._id, // metro
                startTime: "04:30",
                endTime: "00:30"
            },
            {
                name: "Ligne T1",
                categoryType: createdCategories[2]._id, // tram
                startTime: "05:30",
                endTime: "00:30"
            }
        ]);

        // Générer un tableau de données "Ligne"
        const stops = await StopModel.create([
            // 3 arrêts pour la ligne L1
            {
                name: "Fonsegrives Entiore",
                line: lines[0]._id,
                order: 1,
                longitude: 1.5106573,
                latitude: 43.5796845
            },
            {
                name: "Jean Jaurès",
                line: lines[0]._id,
                order: 2,
                longitude: 1.4486752,
                latitude: 43.6057316
            },
            {
                name: "Sept Deniers - Salvador Dali",
                line: lines[0]._id,
                order: 3,
                longitude: 1.4109335,
                latitude: 43.6143591
            },

            // 3 arrêts pour la ligne A du métro
            {
                name: "Balma-Gramont",
                line: lines[1]._id,
                order: 1,
                longitude: 1.4828058,
                latitude: 43.6291289
            },
            {
                name: "Jean Jaurès",
                line: lines[1]._id,
                order: 2,
                longitude: 1.4486752,
                latitude: 43.6057316
            },
            {
                name: "Basso Cambo",
                line: lines[1]._id,
                order: 3,
                longitude: 1.3922743,
                latitude: 43.5699769
            },

            // 3 arrêts pour la ligne T1 du tram
            {
                name: "Palais de Justice",
                line: lines[2]._id,
                order: 1,
                longitude: 1.444724440574646,
                latitude: 43.59413528442383
            },
            {
                name: "Arènes",
                line: lines[2]._id,
                order: 2,
                longitude: 1.418536,
                latitude: 43.5933638
            },
            {
                name: "Odyssud-Ritouret",
                line: lines[2]._id,
                order: 3,
                longitude: 1.3853446,
                latitude: 43.6362055
            },
        ]);

        // Insérer les données
        await UserModel.insertMany(users);
        await CategoryModel.insertMany(createdCategories);
        await LineModel.insertMany(lines);
        await StopModel.insertMany(stops);

        console.log('Base de données initialisée avec 3 utilisateurs');
        console.log('Base de données initialisée avec 3 catégories');
        console.log('Base de données initialisée avec 3 lignes');
        console.log('Base de données initialisée avec 3 arrêts pour chaque ligne');

    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données :', error);
    } finally {
        // Fermer la connexion
        await mongoose.connection.close();
    }
}

// Lancer la génération de données
seedDatabase();