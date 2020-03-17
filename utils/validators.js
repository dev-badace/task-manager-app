const User = require('../src/models/users')
const {check} = require('express-validator')
const {isUserPassword} = require('./helper')

module.exports = {
  emailValidation: 
    check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Not a valid email address')
    .custom( async email => {

       const user = await User.find({email})
       if(user.length >0) throw new Error('User already exists')

    }),
  passwordValidation:
    check('password')
    .trim()
    .isLength({min:6,max:20})
    .withMessage('Password must be min 6 charachters and Max 20 characters'),
  passwordConfirmation:
    check('confirmPassword')
    .trim()
    .isLength({min:6,max:20})
    .custom((password,{req})=>{
      if(password !== req.body.password) throw new Error('Passwords must match');
      return true
    }),
  registeredUserEmail:
    check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Not a valid Email')
    .custom(async email =>{
      const user = await User.find({email})
      if(user.length === 0) throw new Error('User is not registered')
    }),
  registeredUserPassword:
    check('password')
    .trim()
    .custom(async (password,{req}) =>{
      const user = await User.findOne({email:req.body.email})
      if(!user) {
        throw new Error(' ')};
      const isPasswordValid = await isUserPassword(password,{id:user._id})
      if(!isPasswordValid) throw new Error('Invalid Password');
      
    }),
  newPasswordValidation:
    check('newPassword')
    .trim()
    .isLength({min:6,max:20})
    .withMessage('Password must be min 6 charachters and Max 20 characters'), 
  currentPasswordValidation:
    check('currentPassword')
    .trim()
    .isLength({min:6,max:20})
    .withMessage('Password must be min 6 charachters and Max 20 characters'),  
}