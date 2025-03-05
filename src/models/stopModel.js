const mongoose = require('mongoose');

const stopSchema = mongoose.Schema(
  {
    name: {
       type: String, 
       required: true 
    },
    line: {
       type: mongoose.Schema.Types.ObjectId, 
       ref: 'Line',
       required: true 
    },
    order: {
       type: Number, 
       required: true 
    },
    longitude: {
       type: Number, 
       required: true 
    },
    latitude: {
       type: Number, 
       required: true 
    },
   },
   { timestamps: true }
);

module.exports = mongoose.model('Stop', stopSchema);