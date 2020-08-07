const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

const {emailValidation,passwordValidation,passwordConfirmation,
       registeredUserEmail,registeredUserPassword} = require('../../../utils/validators')
const {handleError} = require('../../middlewares/error')
const User = require('../../models/users')
// const {sendWelcomeEmail} = require('../../emails/account')


const router = express.Router()
const upload = multer({
  limits:{
    fileSize: 1500000
  },
  fileFilter(req,file,callback){
  
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return callback(new Error('Incorrect file type'))
    }
     callback(undefined,true)
  }
})

router.get('/login',(req,res) =>{
  res.render('auth/login')
})

router.post('/login',
  [
    registeredUserEmail,
    registeredUserPassword
  ],
  handleError('auth/login','Invalid Credentials'),
async (req,res) =>{

  try{
    
    const user = await User.findByCredentials(req.body.email,req.body.password)
    req.session.userId = user._id
    req.session.error = ''
    res.redirect('/')
  }catch(e){
    console.log(e)
  }

})

router.get('/signup',(req,res) =>{
  res.render('auth/signup')
})

router.post('/signup',
  upload.single('image'),
  [
    emailValidation,
    passwordValidation,
    passwordConfirmation
  ],
  handleError('auth/signup')
  ,
  async (req,res) =>{
  //success

  let avatar
  if(req.file){
    console.log('hey')
    const buffer = await sharp(req.file.buffer).resize({height:250,width:250}).png().toBuffer()
    avatar = buffer
  }
  
  const {name,email,password} = req.body;
  const user = await User.create({name,email,password,avatar})

   //********************************************************** */
 //! sendWelcomeEmail(email,name)   // disabled functionality
   //************************************************************ */


  req.session.userId = user._id
  res.redirect('/')

},(err,req,res,next) =>{
  req.session.error = err.message

  res.redirect('/signup')
})

router.get('/logout',(req,res) =>{
  req.session.userId = ''
  res.redirect('/')
})

module.exports = router