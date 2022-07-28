let application = require('./controller/application')
const mongoose = require('mongoose')
const keys = require('./config/keys');
const kubernetesChecker = require('./kubernetesCheckerStatus')
let setStatus = require('./setStatus')


mongoose.connect(keys.mongiURI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err))

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function init() {
  await sleep(15000);
}

const answer = async () => {
  let id,stat
  try {
  let apps = await application.getAll()
  for (const item of apps) {
    [id,stat] = await kubernetesChecker.checkStatus(item)
    if (
      stat === 'False' && item.status === 'running'
    ) {
      console.log(`App with ${id} is unhealthy`)
      setStatus.set(id,stat);
    }
    else if (
      stat === 'True' && item.status != 'running'
      ) {
      console.log(`App with ${id} is healthy`)
      setStatus.set(id,stat);
    }
  }

  console.log('sleeping')
  await init() 
  answer()
  }
  catch (err) {
    console.log(err)
  }
}

answer() 


