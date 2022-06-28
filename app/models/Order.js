const mongoose = require('mongoose')
const { stringify } = require("querystring")
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
})

module.exports = mongoose.model('orders', ordersSchema)


