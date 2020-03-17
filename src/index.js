const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cookieSession = require('cookie-session')
const hbs = require('hbs')
require('./db/mongoose')
require('../utils/helper')
const User = require('./models/users')

const authRoutes = require('./routes/authRoutes/auth')
const taskRoutes = require('./routes/taskRoutes/tasks')
const userRoutes = require('./routes/userRoutes/users')

const port = process.env.PORT

const app = express()

const publicPath = path.join(__dirname,'../public')
const partialsPath = path.join(__dirname,'../templates/partials')
const viewsPath = path.join(__dirname,'../templates/views')

app.set('views',viewsPath)
app.set('view engine','hbs')
app.use(express.static(publicPath))
hbs.registerPartials(partialsPath)

app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieSession({
  keys: [process.env.JWT_SECRET] // ideal way is to store encryption key in a  config
}))
app.use((req, res, next) =>{
  res.locals.session = req.session;
  next();
});
app.use(express.json())
app.use(methodOverride('_method'))




app.use(authRoutes)
app.use(taskRoutes)
app.use(userRoutes)



app.get('/',(req,res)=>{
  
  let session = req.session
  session.error = ''
  res.redirect('/tasks')
})

app.get('*',(req,res)=>{
  res.redirect('/')
})


app.listen(port,() => console.log(`Listening on port ${port} `));
