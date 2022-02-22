const { Schema, model } = require('mongoose');

const BookSchema = new Schema({
    title: {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        autopopulate: true
    },
    description: {
        type: String,
    },
    institution: {
        type: String,
    },
    faculty: {
        type: String,
    },
    image_url: {
        type: String
    },
}, {
    timestamps: true
});

BookSchema.index({ 'title': 'text' });

BookSchema.plugin(require('mongoose-autopopulate'));

module.exports = model('book', BookSchema)