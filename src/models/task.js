const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    complete:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User"


    }
},{
    timestamps:true
})

// taskSchema.pre("save",async function(next){
//     const task = this
//     console.log("just before saving OK")
//     next()
// }

// )


const Task = mongoose.model("Task",taskSchema)
// const task1 = new Task({description:"Dsa course"})

// task1.save().then((task1)=>{
//     console.log(task1)
// }).catch((error)=>{console.log(error)})


module.exports = Task