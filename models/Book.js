const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		author: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		pdfUrl: {
			type: Buffer,
			required: true,
		},
		coverUrl: {
			type: Buffer,
			required: true,
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Book', bookSchema);
