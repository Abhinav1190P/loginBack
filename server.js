const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const mongoose = require('mongoose')
const {User}  = require('./models/user_model')
require('dotenv').config();
const {auth} = require('./middleware/auth')
mongoose.Promise = global.Promise
mongoose.connect('mongodb+srv://abhinavuser:abhinav100@cluster0.jrmhu.mongodb.net/TL?retryWrites=true&w=majority')
const app = express()


const cors = require('cors');
app.use(cors({origin:'https://kind-goldstine-d209f7.netlify.app'}));


app.use(bodyParser.json())
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.status(200).send("THIS IS HOME")
})

app.post('https://login1x.herokuapp.com/usersignup',(req,res)=>{
const user = new User(req.body)


user.save((err,doc)=>{
if(err) return res.status(400).send(err);
return res.status(200).json({
message: 'You have signed up'
})

})
})


app.post('https://login1x.herokuapp.com/userlogin',(req,res)=>{
User.findOne({"email":req.body.email},(err,user)=>{
    if(!user) return res.status(400).json({message:'User not found'})
user.checkPass(req.body.firstPass,(err,isTrue)=>{
if(err) return res.status(400).json({message:'Password is wrong'})
     
else{
    user.generateToken((err,user)=>{
        if(err) return res.status(400).send(err);
        res.cookie('auth',user.token).json({
            isAuth:true, 
            id:user._id,
            email:user.email
        })
    })   
}
    
})

})

})

app.get('https://login1x.herokuapp.com/user',auth,(req,res)=>{
res.status(200).json({
    isAuth: true
})
})


const port = process.env.PORT || 3001

app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})






