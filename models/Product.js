const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  inStock: { type: Boolean, required: true },
});

// 1er arg : Nom du Model | 2éme arg : le schéma à exporter
module.exports = mongoose.model('Product', productSchema);