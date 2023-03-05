const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HikeSchema = new Schema({
    title: String,
    image: String,
    difficulty: Number,
    description: String,
    location: String
});

module.exports = mongoose.model('Hike', HikeSchema);