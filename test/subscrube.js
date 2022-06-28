var amqp = require('amqplib/callback_api');

amqp.connect('amqp://app:app@192.168.110.132:32224', function(error0, connection) {;
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    let queueName = 'technical'
    channel.assertQueue(queueName, {
      durable: false
    })
    channel.consume(queueName,(msg) => {
      console.log(msg.content.toString())
      channel.ack(msg)
    })
  })
})