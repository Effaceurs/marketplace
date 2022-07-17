let application = require('./controller/application')
const mongoose = require('mongoose')
const keys = require('./config/keys');
const kubernetesChecker = require('./kubernetesCheckerStatus')


mongoose.connect(keys.mongiURI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err))



const answer = async () => {
  try {
  let status = await application.getAll()
  await kubernetesChecker.checkStatus(status)
  }
  catch (err) {
    console.log(error)
  }
}


answer()