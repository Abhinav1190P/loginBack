const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const salt_i = 10;
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({

name:{
    type: String,
    minlength:5,
    maxlength: 20,
    required: true
},
lastname:{
    type: String,
    minlength:5,
    maxlength: 20,
    required: true
},
email:{
    type:String,
    unique: 1,
    required: true
},
firstPass:{
type: String,
minlength: 5,
maxlengthL: 20,
required: true
}
,
token:{
    type:String
}


})


userSchema.pre("save",function(next){
    var user = this;

    if(user.isModified('firstPass')){
        bcrypt.genSalt(salt_i,function(err,salt){
            if(err) return next(err);

            bcrypt.hash(user.firstPass,salt,function(err,hash){
                if(err) return next(err);
                user.firstPass = hash;
                next();
            })
        })
    } else {
        next();
    }
})


userSchema.methods.checkPass = function(pass,cb){
    var user = this;
    bcrypt.compare(pass,user.firstPass,(err,isTrue)=>{
if(err){
    return cb(err)
}
else{
    return cb(null,isTrue)
}

    })

}


userSchema.methods.generateToken = function(cb){
    
    var user = this;
    var token = jwt.sign(user._id.toHexString(),'abhinavp')
    
    user.token = token

user.save(function(err,user){
   if(err) return cb(err);
   cb(null,user)
})
    }

userSchema.statics.findByToken = function(token,cb){
const user = this;
jwt.verify(token,'abhinavp',function(err,decode){
    user.findOne({"_id":decode,"token":token},(err,user)=>{
        if(err) return cb(err)
        cb(null,user)
        
    })
})



}    
    




const User = mongoose.model('User',userSchema)

module.exports = {
    User
}

