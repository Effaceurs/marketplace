const amqp = require('amqplib/callback_api');
const keys = require('../config/keys')

module.exports.deploy = async function (req, res) {
  console.log(req.body)
  let user =
    req.user.email.split('@')[0] +
    req.user.email.split('@')[1].replace('.', '-');
  let id = req.body._id;
  let email = req.user.email;
  console.log(keys.amq)
  amqp.connect(keys.amq, function(error, connection) {;
  if (error) {
    console.log(error);
  }
  connection.createChannel((error, channel) => {
    if (error) {
      console.log(error);
    }
    let queueName = 'application'
    let message = {'body': req.body, email, user }
    channel.assertQueue(queueName, {
      durable: false
    })
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
    setTimeout(() => {
      connection.close()
    }, 1000)
  })
})
res.status(200).json('1');
}