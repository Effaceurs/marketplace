const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ordersSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
  },
  replicas: {
    type: Number
  },
  url: {
    type: String,
  },
  version: {
    type: String,
  },
  user: {
    type: String,
  },
  status: {
    type: String,
  },
  terraform: {
    type: Boolean,
  }
})

module.exports = mongoose.model('orders', ordersSchema)


