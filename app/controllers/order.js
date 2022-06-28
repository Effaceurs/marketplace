const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');

module.exports.getAll = async function (req, res) {
  try {
    const apps = await Order.find({user : req.user.email});
    return res.status(200).json(apps);
  } catch (error) {
    errorHandler(res, error);
  }
};
  
module.exports.create = async function (req, res) {
  try {
    const order = await new Order({
      name: req.body.name,
      userId: req.user.id,
      user: req.user.email,
      version: req.body.version,
      replicas: req.body.replicas? req.body.replicas : 1,
      url: 'undefined',
      status: 'pending',
    }).save();
    res.status(200).json(order);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.update = async function (req, res) {
  try {
    const update = await Order.findOneAndUpdate(
      {
        _id: req.body.id,
      },
      { status: req.body.status,
        url: req.body.url 
      }
    );
    res.status(200).json(update);
  } catch (error) {
    errorHandler(res, error);
  }
};
