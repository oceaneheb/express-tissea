const mongoose = require('mongoose');
const LineModel = require('../models/lineModel');
const CategoryModel = require('../models/categoryModel');
const asyncHandler = require('express-async-handler')

// Ajouter une nouvelle ligne
const addLine = asyncHandler(async (req, res) => {
  try {
    
    const { name, categoryType, startTime, endTime } = req.body;

    // Vérifier que tous les champs sont remplis
    if (!name || !categoryType || !startTime || !endTime) {
        return res.status(400).json({
            success: false,
            message: "Veuillez remplir tous les champs"
        });
    }

    // Vérifier que la ligne n'existe pas en BDD
    const line = await LineModel.findOne({name: name});

    if (!line) {
      const newLine = new LineModel({
        name,
        categoryType,
        startTime,
        endTime
      })
      await newLine.save();

      // Si la ligne est créée avec succès, renvoyer les données
      if (newLine) {
          res.status(201).json({
            newLine
          });
      } else {
        return res.status(400).json({
            success: false,
            message: "Données de ligne invalides"
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: `La ligne ${name} existe déjà en BDD`
      });
    }
    
  } catch (error) {
    console.error(`Erreur lors de la création de la ligne: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
})

// Retourne la liste de toutes les lignes de la catégorie de transport précisée par :id


module.exports = {
    addLine
}