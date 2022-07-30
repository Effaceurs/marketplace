const Application = require('../models/Application');



module.exports.getAll = async function (req, res) {
  function epoch (date) {
    return Date.parse(date)
  }
  
  const dateNow = new Date() 
  const timestamp = epoch(dateNow)

  try {
    const applications = await Application.find();
    const filtered = applications.filter(value => ((timestamp - epoch(value.date)) > 150000) )
    return filtered.map((value) => ({
      image: value.image,
      name: value.name,
      id: value._id,
      namespace: value.user.replace('@', '').replace('.', '-'),
      status: value.status
    }));
  } catch (err) {
    console.log(err);
  }
};
