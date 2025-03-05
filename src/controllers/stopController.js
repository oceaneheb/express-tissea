const mongoose = require('mongoose');
const StopModel = require('../models/stopModel');
const LineModel = require('../models/lineModel');
const asyncHandler = require('express-async-handler')

// Ajouter un nouvel arrêt
const addLineStop = asyncHandler (async (req, res) => {
  try {
    const { id, lineId } = req.params;
    const { name, order, longitude, latitude } = req.body;

    // Vérifier que tous les champs sont remplis
    if (!name || !order || !longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: "Veuillez remplir tous les champs"
      });
    }

    // Vérifier que la ligne existe
    const line = await LineModel.find({
      _id: lineId,
      categoryType: id
    });

    if (!line) {
      return res.status(404).json({
        success: false,
        message: "Ligne non trouvée"
      })
    }

    // Identifier le terminus
    const maxOrder = await StopModel.findOne({ line: lineId }).sort('-order').select('order');

    // Créer le nouvel arrêt
    const newStop = new StopModel({
      name,
      line: lineId,
      order,
      longitude,
      latitude,
    });

    // Ajuster l'ordre des arrêts existants si nécessaire
    if (order <= maxOrder?.order) {
      await StopModel.updateMany(
        { line: lineId, order: { $gte: order } },
        { $inc: { order: 1 } }
      );
    }
    await newStop.save();

    // Si l'arrêt est créé avec succès, renvoyer les données
    if (newStop) {
      res.status(201).json({
        newStop
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Données d'arrêt invalides"
      });
    }

  } catch (error) {
    console.error(`Erreur lors de la création de l'arrêt : ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Supprimer un arrêt sur une ligne 
const deleteLineStop = asyncHandler (async (req, res) => {
  try {
    const { id, lineId, stopId } = req.params;

    // Vérifier que la ligne existe
    const line = await LineModel.findOne({
      _id: lineId,
      categoryType: id
    });

    if (line) {
      // Vérifier que l'arrêt en question existe
      const stop = await StopModel.findOne({
        _id: stopId,
        line: lineId
      });

      if (stop) {
        await StopModel.deleteOne({_id: stopId});

        // Réorganiser l'ordre des arrêts restants
        await StopModel.updateMany(
          {line: lineId, order: { $gt: stop.order }},
          { $inc: { order: -1 } }
        );

        // Si l'arrêt a été supprimé, renvoyer les données
        res.status(200).json({
          success: true,
          message: `L'arrêt ${stop.name} a été supprimé`
        });

      } else {
        return res.status(404).json({
          success: false,
          message: `L'arrêt n'existe pas`
        });
      }

    } else {
      return res.status(404).json({
        success: false,
        message: `La ligne n'existe pas`
      })
    }
    
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'arrêt : ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
})

module.exports = {
  addLineStop,
  deleteLineStop
}