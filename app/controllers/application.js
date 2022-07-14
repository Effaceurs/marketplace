const Application = require('../models/Application');
const errorHandler = require('../utils/errorHandler');

module.exports.getAll = async function (req, res) {
  try {
    const apps = await Application.find({user : req.user.email});

    return res.status(200).json(apps);
  } catch (error) {
    errorHandler(res, error);
  }
};
  
module.exports.create = async function (req, res) {
  console.log(req.body)
  console.log(req.user)

  try {
    const order = await new Application({
      name: req.body.name,
      userId: req.user.id,
      user: req.user.email,
      version: req.body.version,
      replicas: req.body.replicas? req.body.replicas : 1,
      url: 'pending',
      status: 'pending',
      provider: req.body.provider
    }).save();
    console.log(order)
    res.status(200).json(order);
  } catch (error) {
    console.log(error)
    errorHandler(res, error);
  }
};
