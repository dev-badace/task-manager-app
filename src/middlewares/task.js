const Task = require('../models/tasks')

const isAuthorized = async (req,res,next) =>{
  const task = await Task.findById({_id:req.params.id})
  if(!task) {
    req.session.error = 'no tasks found'
    console.log('her1')
    return res.redirect('/')
  }
  if(  !task.author.equals(req.session.userId)) {
    req.session.error = 'You are not authorised for the task'
    
    return res.send('revoked')
  }
  next()
}

module.exports = isAuthorized