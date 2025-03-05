const CategoryModel = require('../models/categoryModel');
const mongoose = require('mongoose');
const LineModel = require('../models/lineModel');
const StopModel = require('../models/stopModel');
const asyncHandler = require('express-async-handler')

// Créer une catégorie
const addCategory = async(req, res) => {
  try {
    const { name } = req.body;

    // Vérifier que les champs sont remplis
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Veuillez remplir tous les champs"
      });
    }

    // Vérifier que la catégorie n'existe pas déjà en BDD
    const category = await CategoryModel.findOne({name: name});

    if (!category) {
      const newCategory = new CategoryModel({ name });
      await newCategory.save();

      // Si la catégorie est créée avec succès, renvoyer les données
      if (newCategory) {
        res.status(201).json({
          newCategory
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Données de catégorie invalides"
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: `La catégorie ${name} existe déjà en BDD`
      });
    } 

  } catch(error) {
    console.log(`Erreur lors de la création de la catégorie: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
}

// Retourne la liste de toutes les lignes de la catégorie de transport précisée par :id
const getCategoryLines = async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de catégorie invalide'
      });
    }
    
    // Vérifier si la catégorie existe
    const category = await CategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }
    
    // Récupérer toutes les lignes associées à cette catégorie
    const lines = await LineModel.find({ categoryType: categoryId });
    
    res.status(200).json({
      success: true,
      category: {
        type: category.name
      },
      count: `Il y a ${lines.length} ligne(s) dans la catégorie ${category.name}`,
      data: lines
    });
  } catch (error) {
    console.error(`Erreur lors de la récupération des lignes de la catégorie: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// Retourne les détails de la ligne précisée par :idCategory et :idLine
const getLineDetails = async (req, res) => {

  try {
    const categoryId = req.params.id;
    const lineId = req.params.lineId;

    // Récupérer la ligne associée
    const line = await LineModel.findOne({
      _id: lineId,
      categoryType: categoryId
    });

    // Si la ligne existe, récupérer les arrêts associés
    if (line) {

      // Récupérer la liste des arrêts de la ligne
      const stops = await StopModel.find({ line: line._id }).sort('order');

      return res.status(201).json({
        success: true,
        line: {
          name: `Nom de la ligne : ${line.name}`,
          createdAt: `Date de création de la ligne : ${line.createdAt}`,
          startTime: `Début d'activité : ${line.startTime}`,
          endTime: `Fin d'activité : ${line.endTime}`,
        },
        // Retourner le nom des arrêts dans l'ordre
        stop: stops.map(stop => stop.name)
      });

    } else {
      return res.status(404).json({
        success: false,
        message: 'Ligne non trouvée ou n\'appartient pas à cette catégorie'
      });
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Retourne la liste détaillée des arrêts d'une ligne précisée par :id
const getLineStops = async (req, res) => {
  try {

    const categoryId = req.params.id;
    const lineId = req.params.lineId;

    // Récupérer la ligne associée
    const line = await LineModel.findOne({
      _id: lineId,
      categoryType: categoryId
    });

    if (line) {
      // Récupérer les arrêts associés
      const stops = await StopModel.find({ line: line._id })
      .sort('order')
      .select('name longitude latitude order');

      if (stops) {
        return res.status(201).json({
          stops
        })
      } else {
        return res.status(400).json({
          message: `Aucun arrêts associés à la ligne ${line.name}`
        });
      }

    } else {
      return res.status(400).json({
        message: 'Ligne non trouvée ou n\'appartient pas à cette catégorie'
      })
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Modification des détails de la ligne précisée par :id
const updateLine = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const lineId = req.params.lineId;

    // Vérifier si la ligne existe
    const line = await LineModel.findOne({
      _id: lineId,
      categoryType: categoryId
    })

    if (line) {

      const lineUpdate = await LineModel.findByIdAndUpdate(
        req.params.lineId,
        { 
          name: req.body.name,
          categoryType: categoryId,
          startTime: req.body.startTime, 
          endTime: req.body.endTime 
        },
        { new: true }
      );
      res.json(lineUpdate);

    } else {
      res.status(404).json({
        success: false,
        message: "La ligne que vous souhaitez modifier n'existe pas"
      });
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCategoryLines,
  addCategory,
  getLineDetails,
  getLineStops,
  updateLine
}