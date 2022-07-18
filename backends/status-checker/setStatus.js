let Application = require('./models/Application')
const keys = require('./config/keys');

module.exports.set = async function (id,status) {
  if (status === 'True') {
    status = 'running'
  }
  else {
    status = 'down'
  }
  try {
    await Application.findOneAndUpdate(
      {
        _id: id,
      },
      { status: status,
      }
    );
  return 'Item has been updated'
  } catch (error) {
    console.log(error)
  }

}