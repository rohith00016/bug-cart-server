npm i express mongoose cors dotenv jsonwebtoken nodemon bcryptjs nodemailer multer sharp

files
.gitignore
index js
.env

folders
db >>> connection.js
model >>> userModel.js
routes >> userRoutes.js
middleware >> auth.js
-------
update the script
-----------
index.js

const express = require ('express')
const app = express()

//Create a route for home page

app.get('/',(req,res)=>{
    res.send("Welcome to MovieStation")
})

const PORT = 8001
app.listen(PORT,()=>{
    console.log("Server Started at PORT NO",PORT)
})
-----------------------------
connection with Database
.ev         >> storing critical information which we dont want to expose
connection.js >> mongodb connection
index.js    >> import dotenv and connection.js
-------------------------------------------------------
create a model
usermodel:
const mongoose=require('mongoose')

const userSchema = new mongoose,Schema({
    name:{type:String,required:true},
    age:{typr:Number,required:true},
    phone_number:{type:Number,required:true},
    email:{type:String,required:true},
    password:{type:String}
},{
    timestamps:true
})

const User = mongoose.model("User",userSchema)

module.exports=User
--------------------------------------------
moviemodel:
---------------------------------------------
Creating a Model
userModel
movieModel
contactusModel

Public:
Home
About
Service
Contact     >Model
Sign In     >Model  - userModel
Sign Up     >Model  - userModel

Private
AllMovies   >Model movieModel GET
AddMovie    >Model movieModel POST
Edit        >Model movieModel PATCH/PUT
Delete      >Model movieModel DELETE
Cart >> Redux >Model orderModel

cart >
movieName:
Rating:
Amount:


Fumika 
URL:https://github.com/Fumika0523/BackEnd_MovieStation_11-09-2024

Poonam
URL:https://github.com/PoonamChauhan229/BackEnd_MovieStation_11-09-2024