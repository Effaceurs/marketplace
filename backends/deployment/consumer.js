const keys = require('./config/keys');
const amqp = require('amqplib/callback_api');
const request = require('request');
const fs = require('fs');
const StreamZip = require('node-stream-zip');
let nodeIp = '192.168.110.134'; // need to fix

async function checkStatus(message) {
  let id;
  let payload = {};
  payload.message = message;
  request.post(
    {
      url: keys.gitlaburl + keys.gitlabpipeline + keys.gitlabpipelinetoken,
      form: {
        variables: {
          ID: message.body.name + message.body._id,
          MODULE_NAME: message.body.name,
          REPLICAS: message.body.replicas,
          NAMESPACE: message.user,
          CUSTOMERNAME: message.user,
        },
      },
    },
    function (error, response, body) {
      id = JSON.parse(body).id;
      console.log('id - ', id);
    }
  );

  if (fs.existsSync('artifact.zip')) {
    fs.unlinkSync('artifact.zip');
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
  let success;
  let artifactValue;
  let jobId;
  request.get(
    {
      url: keys.gitlaburl + '/pipelines/' + id + '/jobs',
    },
    function (error, response, body) {
      const answer = JSON.parse(response.body);
      const pushStage = answer.filter((stages) => stages.name === 'push');
      jobId = pushStage[0].id;
    }
  );
  await new Promise((resolve) => setTimeout(resolve, 2000));
  for (let i = 0; i <= 15; i++) {
    if (success === true) {
      console.log('job has been processed');
      break;
    }
    request.get(
      {
        url: keys.gitlaburl + '/jobs/' + jobId,
        headers: { 'PRIVATE-TOKEN': keys.gitlabtoken },
      },
      function (error, response, body) {
        let jobStatusAnswer = JSON.parse(response.body);
        console.log(jobStatusAnswer.status);

        if (jobStatusAnswer.status === 'success') {
          success = true;
          jobStatusAnswer.status = 'processed';
          console.log('Downloading an artifact of job with id - ', jobId);
          request
            .get({
              url: `${keys.gitlaburl}/jobs/${jobId}/artifacts`,
              headers: { 'PRIVATE-TOKEN': keys.gitlabtoken },
              encoding: null,
            })
            .pipe(fs.createWriteStream('artifact.zip'))
            .on('close', function () {
              console.log('File written!');
            });
        } else if (i == 15) {
          artifactValue = 'ERROR OCCURED';
        }
      }
    );
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  if (artifactValue === 'ERROR OCCURED') {
    payload.message.body.status = 'failed';
  } else {
    payload.message.body.status = 'running';
  }
  await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    const zip = new StreamZip({
      file: 'artifact.zip',
      storeEntries: true,
    });
    zip.on('ready', () => {
      let zipDotTxtContents = zip.entryDataSync('output.txt').toString('utf8');
      artifactValue = zipDotTxtContents;
      payload.artifact = artifactValue;
      console.log(payload);
      console.log('sending a message')
      sendMessage(payload);
      zip.close();
    });
  } catch {
    payload.artifact = null;
    console.log('sending a message')
    sendMessage(payload);
  }
}

function sendMessage(payload) {
  amqp.connect(keys.amq, function (error, connection) {
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
}

amqp.connect(keys.amq, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    let queueName = 'applicationDeploymentRequest';
    channel.assertQueue(queueName, {
      durable: false,
    });
    channel.consume(queueName, (msg) => {
      const message = JSON.parse(msg.content.toString());
      checkStatus(message);
      console.log('MESSAGE PROCESSED');
      channel.ack(msg);
    });
  });
});
