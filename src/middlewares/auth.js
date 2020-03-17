const User = require('../models/users')


const auth = async (req,res,next) =>{

  if(!req.session.userId) {
    req.session.error = "Please Login First"
    return res.redirect('/login')
  }

  next();

}


module.exports = auth