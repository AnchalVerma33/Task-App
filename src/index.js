const express = require("express")
require("./db/mongoose")
const User = require("./models/user")
const Task = require("./models/task")
// const { findByIdAndUpdate } = require("./models/user")
const userrouter = require("./routers/user")
const taskrouter = require("./routers/task")

 
const app = express()
const port = process.env.Port || 3000

//middleware functions 

// app.use((req,res,next)=>{
//     if(req.method == "GET"){
//         res.send("Get request is disabled")
//     }
//     else{
//         next()
//     }
// })

// app.use((req,res,next)=>{
//     res.status(503).send("Site is currently down.Try after some time")
// })



app.use(express.json())
app.use(userrouter)
app.use(taskrouter)




// jsonwebtoken

// const jwt = require("jsonwebtoken")
// const newFunction  = async(req,res)=>{
//     const token = jwt.sign({id:"abcd1234"},"this is my course",{expiresIn:"7 days"})
//     console.log(token)
//     const data= jwt.verify(token,"this is my course")
//     console.log(data)
// }

// newFunction()

//--------------------------------------------------------------------------

//hash password

// const bcrypt = require("bcrypt")

// const newFunction =  async(req,res)=>{
//     const password = "Red123456"
//     const hashpassword = await bcrypt.hash(password,6)
//     console.log(password)
//     console.log(hashpassword)

//     const isMatch = await bcrypt.compare("red57382032",hashpassword)
//     console.log(isMatch)
// }
// newFunction()
//-----------------------------------------------------------------------------------------------

// File uploads

const multer = require("multer")
const upload = multer({
//    dest:"images" ,
   limits:{
       fileSize:1000000
   },
   fileFilter(req,file,cb){
    //    if(!file.originalname.endsWith("pdf")){
    //        return cb(new Error("Please upload a pdf"))
    //    }
    if(!file.originalname.match(/\.(doc|docx)$/)){
        return cb(new Error ("Please upload a word document"))
    }
       cb(undefined,true)
    //    cb(new Error ("Please upload a pdf"))
    //    cb(undefined,true)
      
   }
})
// const errorMiddleware = ()=>{
//     throw new Error("From my middleware")
// }
app.post("/upload",upload.single("upload"),async(req,res)=>{
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

app.listen(port,()=>{
    console.log("Server Starting up at " + port)
})


//------------------------------------------------------------------------------

// toJSON method of hiding data

// const pet ={
//     name: "bruno"
// }

// pet.toJSON = function(){
//     console.log(this)
//     return this
// }

// console.log(JSON.stringify(pet))
//---------------------------------------------------------------------------------------------


// get user and his task
const main = async()=>{
    // const task = await Task.findById("62136b7c49678e3ee6212853")
    // await task.populate("owner")
    // console.log(task.owner)

    const user = await User.findById("62136541ab61bdbc0b915471")
    await user.populate("mytasks")
    console.log(user.mytasks)
}
// main()
//------------------------------------------------------------------------

