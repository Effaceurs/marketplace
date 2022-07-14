const Catalogue = require('../models/Catalogue');
const errorHandler = require('../utils/errorHandler');

module.exports.getAll = async function (req, res) {
  try {
    const catalogues = await Catalogue.find();
    return res.status(200).json(catalogues);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports.add = async function(req, res) {
  try{
    console.log(req.body)
    const catalogue = await new Catalogue({
      name: req.body.name,
      version: req.body.version,
      provider: req.body.provider,
    }).save();
    res.status(200).json(catalogue);
  }
  catch (error) {
    console.log(res, error)
    errorHandler(res, error);
  }
}