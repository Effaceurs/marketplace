const keys = require('./config/keys')
const amqp = require('amqplib/callback_api');
const request = require('request');

async function checkStatus(id){
  await new Promise(resolve => setTimeout(resolve, 1000));
  let jobId
  let artifacts
  console.log(id)
  request.get({
    url:     keys.gitlaburl+"/pipelines/"+id+'/jobs'
  }, function(error, response, body){
    const answer = JSON.parse(response.body);
    const pushStage = answer.filter(stages => stages.name === 'push')
    jobId = pushStage[0].id
  });
  for (let i=0; i < 15; i++) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    request.get({
      url:     keys.gitlaburl+"/jobs/"+jobId,
      headers: {"PRIVATE-TOKEN": keys.gitlabtoken}
    }, function(error, response, body){
      const jobStatusAnswer = JSON.parse(response.body);
      console.log(jobStatusAnswer.status)
      if (jobStatusAnswer.status === 'success') {
        console.log(jobStatusAnswer.status+'FIN')
      }
    });
  }

}



amqp.connect(keys.amq, function(error0, connection) {;
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    let queueName = 'applicationDeploymentRequest'
    channel.assertQueue(queueName, {
      durable: false
    })
    channel.consume(queueName,(msg) => {
    const message = JSON.parse(msg.content.toString())
    request.post({
      url:     keys.gitlaburl+keys.gitlabpipeline+keys.gitlabpipelinetoken,
      form:    { variables: {'ID': message.body.name+message.body._id,
                             'MODULE_NAME': message.body.name,
                             'REPLICAS': message.body.replicas,
                             'NAMESPACE': message.user,
                             'CUSTOMERNAME': message.user}}
    }, function(error, response, body){
      const id = (JSON.parse(body)).id
      checkStatus(id)
    });
      channel.ack(msg)
    })
  })
})