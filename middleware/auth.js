
const {User} =require('../models/user_model')


let auth = (req,res,next) =>{

    let token = req.cookies.auth

    User.findByToken(token,(err,user)=>{
    if(err) throw err;
 
    if(!user) return res.status(401).json({
        isAuth: false
    })

    req.token = token
    next();

    })


}
module.exports = {
    auth
}
