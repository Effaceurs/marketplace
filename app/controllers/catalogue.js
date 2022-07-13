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
