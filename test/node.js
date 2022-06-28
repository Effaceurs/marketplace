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
    let message = 'This is technical'
    channel.assertQueue(queueName, {
      durable: false
    })
    channel.sendToQueue(queueName, Buffer.from(message))
    setTimeout(() => {
      connection.close()
    }, 1000)
  })
})