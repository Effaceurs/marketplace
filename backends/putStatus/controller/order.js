const Order = require('../models/Order');
let nodeIp = '192.168.110.132'; // need to fix




module.exports.update = async function (req, res) {
  console.log(req)
  console.log(req.payload)
  console.log(req.payload.message)
  console.log(req.payload.message.body)
  console.log(typeof(req))
  console.log(typeof(req.payload))
  console.log(typeof(req.payload.message))
  console.log(typeof(req.payload.message.body))

  const id = req.payload.message.body._id
  const status = req.payload.message.body.status
  const port = req.payload.artifact
  console.log(id,status,port)
  try {
    const update = await Order.findOneAndUpdate(
      {
        _id: id,
      },
      { status: status,
        url: nodeIp+':'+port
      }
    );
  } catch (error) {
    throw (error)
  }
};


