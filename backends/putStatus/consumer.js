let amqp = require('amqplib/callback_api');
let order = require('./controller/order')
const mongoose = require('mongoose')
const keys = require('./config/keys');


mongoose.connect(keys.mongiURI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err))

amqp.connect(keys.amq, function(error0, connection) {;
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    let queueName = 'applicationPutStatus'
    channel.assertQueue(queueName, {
      durable: false
    })
    channel.consume(queueName,(msg) => {
      order.update(JSON.parse(msg.content.toString()))
      //channel.ack(msg)
    })
  })
})