require("../src/db/mongoose.js")
const Task = require("../src/models/task")
const task = require("../src/models/task")

// Task.findByIdAndDelete("6200cfe0f40f434629217a29").then((task)=>{
//     console.log(task)
//     return Task.countDocuments({complete:true}).then((status)=>{
//         console.log(status)
//         return Task.countDocuments({complete:false}).then((status1)=>{
//             console.log(status1)
//         })
//     })
// }).catch((e)=>{
//     console.log(e)
// })

const deletetaskAndCount = async(id,status)=>{
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({complete:status})
    return count 
}

deletetaskAndCount("62067e9392a06a745cee2636",false).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})