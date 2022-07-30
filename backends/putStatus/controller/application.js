const Application = require('../models/Application');
let nodeIp = '192.168.110.132'; // need to fix




module.exports.update = async function (req, res) {
  const id = req.payload.message.body._id
  const status = req.payload.message.body.status
  const port = req.payload.artifact
  let url
  if (port == '') {
    url = port
  }
  else {
    url = nodeIp+':'+port
  }
  console.log(id,status,port)
  try {
    const update = await Application.findOneAndUpdate(
      {
        _id: id,
      },
      { status: status,
        url: url
      }
    );
  return 'Item has been updated'
  } catch (error) {
    console.log(error)
    throw (error)
  }
};


