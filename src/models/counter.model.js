const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const counterModel = new Schema({}, {strict: false});

module.exports = mongoose.model('Counter', counterModel);