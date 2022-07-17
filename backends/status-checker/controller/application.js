const Application = require('../models/Application');

module.exports.getAll = async function (req, res) {
  try {
    const applications = await Application.find();
    return applications.map((value) => ({
      image: value.image,
      name: value.name,
      id: value._id,
      namespace: value.user.replace('@', '').replace('.', '-'),
    }));
  } catch (err) {
    console.log(err);
  }
};
