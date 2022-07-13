const mongoose = require('mongoose')
const Schema = mongoose.Schema

const catalogueSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true,
    default: ''
  },
  provider: {
    type: String,
    default: 'k8s'
  }
})

module.exports = mongoose.model('catalogues', catalogueSchema)