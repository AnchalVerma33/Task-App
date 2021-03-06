require("../src/db/mongoose.js")
const User = require("../src/models/user")

// User.findByIdAndUpdate("62067ffdac85439a5712eddc",{age:1}).then((user)=>{
//     console.log(user)
//     return User.countDocuments({age:1}).then((result)=>{
//         console.log(result)
//     })
// }).catch((e)=>{
//     console.log(e)
// })

const updateAgeAndCount = async(id,age)=>{
    const user = await User.findByIdAndUpdate(id,{age})
    const count = await User.countDocuments({age})
    return count 
}

updateAgeAndCount("6200c5768bd78b18aeb2fb08",19).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})