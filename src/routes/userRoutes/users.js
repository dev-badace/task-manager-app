const express = require('express')
const {validationResult} = require('express-validator')


const {currentPasswordValidation,newPasswordValidation} = require('../../../utils/validators')
const {isUserPassword} = require('../../../utils/helper')
const auth = require('../../middlewares/auth')
const User = require('../../models/users')


const router = express.Router()

router.get('/users/me',[auth], async (req,res) =>{

  const id = req.session.userId ;
  try{
    const user = await User.findById(id)
    if(!user){
     return res.send({
        status: 404
      })
    }
    res.render('users/profile',{user})
  }catch(e){
    res.status(404).send()
  }
})

router.get('/users/edit',[auth], async (req,res) =>{
  const {userId} = req.session
  try{
    const user = await User.findById(userId)
    if(!user){
      return res.send({status:404})
    }
    res.render('users/editProfile',{user})
  }catch(e){
    res.status(404).send()
  }
})

router.put('/users',[auth],async (req,res) =>{
  
  const id = req.session.userId
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name','email','age']
  
  const isOperationValid = updates.every((update) => allowedUpdates.includes(update))

  if(!isOperationValid) return res.status(404).send({status:400,error:'Authorisation Revoked'})
   try{
    const user = await User.findByIdAndUpdate(id,req.body,{new:true})
   }catch{res.status(404).send()}
  
  res.redirect(`/users/me`)
})

router.get('/users/changePassword',[auth],(req,res) =>{
  res.render('users/editPassword')
})

router.put('/users/changePassword',

  [newPasswordValidation,currentPasswordValidation,auth]

 ,async (req,res) =>{
  
  const {id} = req.session.userId
  const {errors} = validationResult(req)
  const {currentPassword,newPassword} = req.body

  if(errors.length !== 0 ) {return res.render('users/editPassword',{errors,id});}

  
  try{
   
   const isValidPassword = await isUserPassword(currentPassword,{id})
   if(!isValidPassword) return res.send({status:'denied'});
   
   const user = await User.findById(id)
   user.password = newPassword
   await user.save()
   res.send({result: 'password changed'})
  }catch(e){
    res.status(404).send()
  }

  res.render('home')
})

router.get('/users/:id/avatar', async (req,res)=>{
  
  try{
    const user = await User.findById(req.params.id)
    if(!user || !user.avatar){
      throw new Error()
    }
    res.set('Content-type','image/png')
    res.send(user.avatar)
  }catch{
    res.status(404).send()
  }
  
})

module.exports = router;