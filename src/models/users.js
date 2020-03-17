const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {isUserPassword} = require('../../utils/helper')

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim: true
  },
  age:{
    type: Number,
    default: 0,
    validate(val){
      if(val < 0) throw new Error('Invalid Value')
    },
    
  },
  email:{
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate(val) {
      if(!validator.isEmail(val)) throw new Error('Not a valid email');
    }
  },
  password:{
    type: String,
    trim: true,
    minlength: 6,
    validate(val){
      if(val.toLowerCase().includes('password') && val.length == 8) throw new Error('Insecure password')
    }
  },

  avatar:{
    type: Buffer
  }
 
},{
  timestamps:true
})

userSchema.virtual('tasks',{
  ref:'Task',
  localField: '_id',
  foreignField: 'author'
})

userSchema.methods.generateAuthToken = async function() {

  const user = this;
  const token = await jwt.sign({_id: user._id.toString()},'secret')
  user.tokens = user.tokens.concat({token})

  await user.save()
  return token

}

userSchema.statics.findByCredentials = async (email,password) =>{
  
  const user = await User.findOne({email})

  if(!user) throw new Error('Auth failed');

  const isPasswordValid = await bcrypt.compare(password,user.password)

  if(!isPasswordValid) throw new Error('Auth failed')

  return user
}

userSchema.pre('save',async function(next) {
  
  const user = this

  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password,8)
  }

  next();
})

const User = mongoose.model('User',userSchema)

module.exports = User