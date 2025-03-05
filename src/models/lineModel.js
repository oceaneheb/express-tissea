const mongoose = require('mongoose');

const lineSchema = mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    categoryType: {
       type: mongoose.Schema.Types.ObjectId, 
       ref: 'Category',
       required: true 
    },
    createdAt: {
       type: Date, 
       default: Date.now 
    },
    startTime: {
       type: String, 
       required: true 
    },
    endTime: {
       type: String, 
       required: true 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Line', lineSchema);
