const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Task = require("./task")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required : true,
        default: "anonymus",
        trim: true
    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Enter valid Email")
            }

        }
        
        },
        password:{
            type:String,
            trim:true,
            minLength:6,
            validate(value){
                if(value.toLowerCase().includes("password")){
                    throw new Error("It Cannot contain password")
                }
            }
        },
    age:{
        type:Number,
        default: 0,
        validate(value){
            if(value<0){
                throw new Error("Age must be a positive number!!!")
            }

        }
    },

    tokens:[{
        token:{
            type:String,
            required:true
        }

    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps : true
})

// const me = new User({name:"   Sonal   ",email:"Sonal@mead.io",age:19,password:"08hghn24"})
// me.save().then((me)=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log("error:",error)
// }))

userSchema.virtual("mytasks",{
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
})

userSchema.methods.toJSON =  function (){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    console.log(userObject)

    return userObject
}

userSchema.methods.generateAuthTokens= async function (){
    const user = this
    const token =  jwt.sign({_id:user._id.toString()},"thisismycourse")
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token

}

userSchema.statics.findByCredentials= async(email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error ("Unable to login")
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error("Uanble to login")
    }
    return user
}

// To hash password before saving 
userSchema.pre("save",async function(next){

    const user = this
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password,8)  
    }

    next()
})

// to delete task when user is deleted 

userSchema.pre("remove",async function (next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model("User",userSchema)


module.exports = User