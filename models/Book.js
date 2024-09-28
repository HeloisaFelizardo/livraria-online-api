const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  author: {
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  pdfUrl: {
    type: String,
    required: true
  },
  coverUrl: {
    type: String,
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);