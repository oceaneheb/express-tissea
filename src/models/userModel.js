const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Ajouter un nom d\'utilisateur']
    },
    email: { 
      type: String, 
      required: [true, 'Ajouter un email'],
      unique: true 
    },
    password: { 
      type: String, 
      required: [true, 'Ajouter un mot de passe'] 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
