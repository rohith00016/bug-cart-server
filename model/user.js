const mongoose=require('mongoose')
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String}
},{
    timestamps:true
})

userSchema.methods.generateAuthToken = async function(req,res){
    const user = this
    const token = jwt.sign({_id:user.id},process.env.JWT_SECRET_KEY)
    console.log(token)
    return token
}

const User = mongoose.model("User",userSchema)

module.exports=User

