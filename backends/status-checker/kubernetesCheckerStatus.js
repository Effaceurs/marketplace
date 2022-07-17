const keys = require('./config/keys');
const request = require('request');
const fs = require('fs');
let setStatus = require('./setStatus')


module.exports.checkStatus = async function (apps) {
  try {
    for (const item of apps) {
      let namespace = item.namespace;
      let deploymentName = item.name + '-' + item.image + '-' + item.id;
      request.get(
        {
          url: keys.kubernetesAPI + namespace + '/deployments',
          headers: {
            Authorization: `Bearer ${keys.TOKEN}`,
          },
          agentOptions: {
            ca: fs.readFileSync('config/ca.crt'),
          },
        },
        function (error, response, body) {
          const appBody = JSON.parse(body).items;
          const currentApp = appBody.find(
            (value) => value.metadata.name === 'a' + deploymentName
          );
          const id = currentApp.metadata.name.split('-')[2];
          let status = currentApp.status.conditions.find((value) => value.type === 'Available').status
          setStatus.set(id,status);
          //if (
          //  status === 'True'
          //) {
          //  setStatus.set(id,status);
          //}
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};

