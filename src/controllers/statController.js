const StopModel = require('../models/stopModel');
const LineModel = require('../models/lineModel');

// Calcule et retourne la distance en kilomètre entre les deux arrêts donnés précisée par :id/:id
const getStopsDistance = async (req, res) => {
    try {
      const stop1 = await StopModel.findById(req.params.stop1Id);
      const stop2 = await StopModel.findById(req.params.stop2Id);
      
      if (!stop1 || !stop2) {
        return res.status(404).json({ message: `Arrêt(s) non trouvé(s) - Arrêt 1 : ${stop1.name} / Arrêt 2 : ${stop2.name}`});
      }
  
      const distance = calculateDistance(
        stop1.latitude, stop1.longitude,
        stop2.latitude, stop2.longitude
      );
  
      res.json({ distance: `La distance entre l'arrêt ${stop1.name} et ${stop2.name} est de ${distance} km` });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};
  
// Calcule et retourne la distance en kilomètre de la ligne entière précisée par :id
const getLineDistance = async (req, res) => {
    try {
      const line = await LineModel.findById(req.params.lineId);

      // Récupérer tous les arrêts de la ligne
        const stops = await StopModel.find({ line: req.params.lineId }).sort('order');
        let totalDistance = 0;

        for (let i = 0; i < stops.length - 1; i++) {
            totalDistance += calculateDistance(
                stops[i].latitude, stops[i].longitude,
                stops[i + 1].latitude, stops[i + 1].longitude
            );
        }

        res.json({ distance: `La distance totale de la ligne ${line.name} est de ${totalDistance} km` });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
  
  // Fonction utilitaire pour calculer la distance
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

module.exports = {
  getStopsDistance,
  getLineDistance
}