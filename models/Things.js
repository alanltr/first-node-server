const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  price: { type: Number, required: true },
});

// 1er arg : Nom du Model | 2éme arg : le schéma à exporter
module.exports = mongoose.model('Thing', thingSchema);