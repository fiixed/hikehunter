const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HikeSchema = new Schema({
    title: String,
    difficulty: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Hike', HikeSchema);