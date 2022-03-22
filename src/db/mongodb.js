// const mongodb = require("mongodb")
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID
const {MongoClient,ObjectID} = require("mongodb")
const connectionURL = "mongodb://127.0.0.1:27017"
const databaseName = 'taskmanager'

// const _id = new ObjectID()
// console.log(_id)
// console.log(_id.getTimestamp())

// ------------------------------------------------------------------------------------------------------------------
MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log("Unable to connect")
    }
    const db = client.db(databaseName)
    db.collection("users").deleteMany({name:"Anchal"}).then((result)=>{
        console.log(result)
    }).catch((error)=>{console.log(error)})



    // ------------------------------------------------------------------------------------------------
    // db.collection("tasks").updateMany({complete:false},{
    //     $set:{
    //         complete:true
    //     }
    // }).then((result)=>{
    //     console.log(result)
    //     }).catch((reject)=>{console.log(error)})
    // -------------------------------------------------------------------------------------------
    // db.collection("tasks").findOne({_id:new ObjectID("61faceea9214aa5b0bee71d8")  },(error,task)=>{
    //     if(error){
    //         return console.log("Unable to find task!!")
    //     }
    //     console.log(task)
    // })
    // db.collection("tasks").find({complete:false}).toArray((error,status)=>{
    //     if(error){
    //         return console.log("Unable to find task!!")
    //     }
    //     console.log(status)
    // })

//-----------------------------------------------------------------------------------------------------------------------
//  Insert one 
//     db.collection("tasks").insertMany([{description:"Complete Node.js course",complete:true},
//     {description:"Study DSA",complete:false},{
//         description:"Study JS",complete:true
//     }],(error,result)=>{
//         if(error){
//             return console.log("Unable to insert id!!")
//         }
//         console.log(result)
//     })
// ----------------------------------------------------------------------------------------------------------------
//    Insert many
//  db.collection('users').insertMany([{
//          name: 'Anchal',
//          age:20
//     },{
//         name:"Alisha",
//         age:20
//     }],(error,result)=>{
//         if(error){
//             return console.log("Unable to insert id!!")
//         }
//          console.log(result)
//      })


 })

