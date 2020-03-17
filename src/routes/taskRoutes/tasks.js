const express = require('express')
const Task = require('../../models/tasks')
const User = require('../../models/users')
const auth = require('../../middlewares/auth')
const isAuthorized = require('../../middlewares/task')
const router = express.Router()


router.get('/tasks',[auth],async (req,res) => {

  const match = {}
  const sort = {}

  if(req.query.completed){
    match.completed = req.query.completed === 'true'? true : false
  }
  
  if(req.query.sortBy){
    const [prop,order] = req.query.sortBy.split(':')
    sort[prop] = order === 'asc'? 1 : -1
  }

  try{
    const user = await User.findById(req.session.userId)
    
    await user.populate({
      path:'tasks',
      match,
      options:{
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate();

    req.session.error = ''
    const tasks = user.tasks
    res.render('tasks/allTasks',{tasks})
  }catch(e){
    res.status(404).send()
  }
 
})

router.get('/tasks/new',[auth],(req,res) => {
 res.render('tasks/newTask')
})

router.post('/tasks',async (req,res) => {

  let {description,completed} = req.body;
  completed === 'on'? completed = true:completed = false;
  let author = req.session.userId;
  try{
    const task = await Task.create({description,completed,author});
    res.redirect(`/tasks/${task._id}`)
  }catch(e){
    res.status(404).send()
  }
  
})

router.get('/tasks/:id',[auth,isAuthorized],async (req,res) => {
  const {id} = req.params;

  try{
    const task = await Task.findById({_id : id});
    res.render('tasks/taskPage',{task})
  }catch(e){
    res.status(404).send()
  }
  
})

router.get('/tasks/:id/edit',[auth,isAuthorized],async (req,res) =>{

  try{
    let {description,completed,_id} = await Task.findById(req.params.id)
    completed === true? completed = 'checked':completed = ' ';
    res.render('tasks/editTask',{description,completed,_id})
  }catch(e){
    res.status(404).send()
  }
  
})

router.put('/tasks/:id',[auth,isAuthorized],async (req,res) =>{
  
  let{completed,description} = req.body
  completed === 'on'? completed = true:completed = false;
  
  try{
   await Task.findByIdAndUpdate(req.params.id,{description,completed},{new:true,runValidators:true})
   res.redirect(`/tasks/${req.params.id}`)
  }catch(e){
    res.status(404).send()
  }


  
})

router.delete('/tasks/:id',[auth,isAuthorized],async(req,res) =>{
  try{

    await  Task.findByIdAndDelete(req.params.id)
    res.redirect('/tasks')

  }
  catch(e){
    res.status(404).send()
  }
})

module.exports = router;