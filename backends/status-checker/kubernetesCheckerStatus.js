const keys = require('./config/keys');
const request = require("request");
const fs = require('fs');


module.exports.checkStatus = async function (item) {
  try {
      let namespace = item.namespace;
      let deploymentName = item.name + '-' + item.image + '-' + item.id;
      const promisifiedRequest = function(options) {
        return new Promise((resolve,reject) => {
          request(options, (error, response, body) => {
            if (response) {
              return resolve(response);
            }
            if (error) {
              return reject(error);
            }
          });
        });
      };


      return (async function() {
        const options = {
          url: keys.kubernetesAPI + namespace + '/deployments',
          headers: {
            Authorization: `Bearer ${keys.TOKEN}`,
          },
          agentOptions: {
            ca: fs.readFileSync('config/ca.crt'),
          },
        }
      
        let response = await promisifiedRequest(options);
      
        const appBody = JSON.parse(response.body).items;
        const currentApp = appBody.find(
          (value) => value.metadata.name === deploymentName
        );
        const id = currentApp.metadata.name.split('-')[2];
        let status = currentApp.status.conditions.find((value) => value.type === 'Available').status
        return [id,status]

      })();
    
  } catch (err) {
    console.log(err);
  }
};

