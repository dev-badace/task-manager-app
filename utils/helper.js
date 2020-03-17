const hbs = require('hbs')
const bcrypt = require('bcryptjs')
const User = require('../src/models/users')

hbs.registerHelper('getError', (errors,param) =>{
  for(error of errors){
    if(error.param === param) return error.msg
  }
  return ''
 })

hbs.registerHelper('substring', string => string.substring(0,100))

hbs.registerHelper('getImg' , userId => {
   return `${process.env.IMG_SITE}/${userId}/avatar`
})



const isUserPassword = async (password,{id,email}) =>{
  let user
  if(!email) user = await User.findById(id);
  if(!id)  user = await User.findById(id);
  
  if(!user) return false
 return await bcrypt.compare(password,user.password)
}


module.exports = {isUserPassword}