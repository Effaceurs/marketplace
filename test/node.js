const amqp = require('amqplib/callback_api');
let payload = {
  message: {
    body: {
      name: 'nginx',
      replicas: 1,
      url: 'undefined',
      version: '1.0',
      user: 'sasha@test.ru',
      status: 'running',
      terraform: true,
      _id: '62cde556e6d4d834b1aa09b5',
      date: '2022-07-12T21:19:18.198Z',
      __v: 0
    },
    email: 'sasha@test.ru',
    user: 'sashatest-ru'
  },
  artifact: '31529'
}


  amqp.connect('amqp://app:app@192.168.110.132:32224', function (error, connection) {
    if (error) {
      console.log(error);
      res.status(500).json('the message has not been sended');
    }
    connection.createChannel((error, channel) => {
      if (error) {
        console.log(error);
      }
      let queueName = 'applicationPutStatus';
      let message = { payload: payload };
      channel.assertQueue(queueName, {
        durable: false,
      });
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
      setTimeout(() => {
        connection.close();
      }, 1000);
    });
  });
