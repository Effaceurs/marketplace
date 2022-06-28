const errorHandler = require('../utils/errorHandler');
const k8s = require('@kubernetes/client-node');
const fs = require('fs').promises;
const yaml = require('js-yaml');
const randomstring = require('randomstring');
const { exit } = require('process');
const DB = require('./order');
const { url } = require('inspector');
const { baseModelName } = require('../models/Category');

let r;
let port;
let filtered;
let filteredPort;

let color
let colors = ['black',
'silver',
'gray',
'white',
'maroon',
'red',
'purple',
'fuchsia',
'green',
'lime',
'olive',
'yellow',
'navy',
'blue',
'teal',
'aqua'
]

const kc = new k8s.KubeConfig();
kc.loadFromFile(
  'D:/soft/msys2/home/user/work/marketplace/app/config/kube_config'
);
const client = kc.makeApiClient(k8s.CoreV1Api);
const client2 = k8s.KubernetesObjectApi.makeApiClient(kc);

module.exports.deploy = async function (req, res) {
  r = randomstring.generate({
    charset: 'qwertyuiopasdfgghjkl',
    length: 6,
  });
  console.log(req.body);
  let user =
    req.user.email.split('@')[0] +
    req.user.email.split('@')[1].replace('.', '-');
  let id = req.body._id;
  let email = req.user.email;
  console.log(user, id);
  try {
    await createNamespace(user);
    await readYaml(user, id)
      .then((res) => {
        console.log('Reading Default YAML');
        saveYaml(res, id, user, email);
        console.log('Saving');
      })
      .catch((err) => {
        console.log(err);
      });
    console.log('Reading updated YAML');
    await readUpdatedAppSpec(id).then((res) => {
          console.log('Deploying app');
          deployApp(res).then((answer) => {
            answer.forEach((value) => {
              value.then((res) => {
                if (res.body.kind == 'Service') {
                  console.log(res.body.spec.ports[0].nodePort);
                  return (port = res.body.spec.ports[0].nodePort);
                }
              });
            });
          });
          console.log('App has been deployed');
        })
      .finally(() => {
        new Promise((resolve) => setTimeout(resolve, 5000))
          .then(() => {
            return getNodeIp(user).then((res) => {
              filtered = res.body.items.filter((val) => {
                return val.metadata.name.split('-')[0] === r;
              });
            });
          })
          .then(() => {
            return getServicePort(user).then((res) => {
              filteredPort = res.body.items.filter((val) => {
                return val.metadata.name === r + '-service';
              });
            });
          })
          .then(() => {
            port = filteredPort[0].spec.ports[0].nodePort;
          })
          .finally(() => {
            let url
            hostIP = filtered[0].status.hostIP;
            url = hostIP + ':' + port;
            console.log(url);
            req = {
              body: {
                status: 'RUNNING',
                url,
                id: req.body._id,
              },
            };
            DB.update(req, res)
              .then((res) => {})
              .catch((err) => {
                console.log(err);
              });
          });
      });
  } catch (error) {
    console.log(error);
  }
};

async function createNamespace(user) {
  return client.listNamespace().then((response) => {
    if (
      response.body.items.some((value) => {
        return value.metadata.name === user;
      })
    ) {
      console.log('Namespace already created');
    } else {
      client
        .createNamespace({
          metadata: {
            name: user,
          },
        })
        .then((response) => {
          console.log(response);
        }),
        (err) => {
          console.log(err);
        };
    }
  });
}

async function readYaml(user, id) {
  return fs.readFile(
    'D:/soft/msys2/home/user/work/marketplace/app/config/k8s_yaml/nginx.yaml',
    'utf-8',
    (err, contents) => {
      if (err) {
        console.log('Some error occured');
        return;
      }
    }
  );
}

async function saveYaml(res, id, user, email) {
  const replaced = res.replace(/name: nginx/g, `name: ${r}`);
  const replaced2 = replaced.replace(/app: nginx/g, `app: ${r}`);
  const replaced3 = replaced2.replace(
    /Hi! This is a conf /g,
    `Hi! This is a conf  ${id} of user ${email}`
  );
  const replaced4 = replaced3.replace(
    /namespace: default/g,
    `namespace: ${user}`
  );
  color = getRandomInt(15)
  const replaced5 = replaced4.replace(
    /background-color:green/g,
    `background-color:${colors[color]}`
  );
   
  fs.writeFile(
    `D:/soft/msys2/home/user/work/marketplace/app/config/k8s_temp/${id}.yaml`,
    replaced5,
    'utf-8',
    (err) => {
      if (err) {
        console.log('err');
      } else {
        console.log('YAML FIXED');
      }
    }
  );
}

async function readUpdatedAppSpec(id) {
  return fs.readFile(
    `D:/soft/msys2/home/user/work/marketplace/app/config/k8s_temp/${id}.yaml`,
    'utf8',
    function (err, contents) {
      if (err) {
        console.log(err);
        return;
      }
    }
  );
}

async function deployApp(contents) {
  let answer = [];
  let specs = yaml.loadAll(contents);
  let validSpecs = specs.filter((s) => s && s.kind && s.metadata);
  for (spec of validSpecs) {
    console.log(`Deploying app ${spec.kind}`);
    answer.push(client2.create(spec));
  }
  return answer;
}

async function getNodeIp(user) {
  return client.listNamespacedPod(user);
}

async function getServicePort(user) {
  return client.listNamespacedService(user);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
