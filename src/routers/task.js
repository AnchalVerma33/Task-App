const express = require("express")
const Task = require("../models/task.js")
const User = require("../models/user.js")
const auth = require("../middleware/auth")
const taskrouter = new express.Router()


taskrouter.post("/tasks",auth,async(req,res)=>{
    // const task1  = new Task(req.body)
    const task1 = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task1.save()
        res.status(201).send(task1)
        }catch(e){
            res.status(400).send(e)
        }
})


// GET /task?limit=2&skip=2
//sortBy= createdAt:desc
taskrouter.get("/tasks",auth,async(req,res)=>{
    try{
        const match = {}
        const sort = {}
        // const task = await Task.find({owner:req.user._id})
        if(req.query.complete){
            match.complete = req.query.complete === "true"
        }
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(":")
            sort[parts[0]] = parts[1]==="desc" ? -1 : 1
        }
        await req.user.populate({
            path : "mytasks",
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.mytasks)
        }catch(e){
            res.status(500).send(e)
        }
})

taskrouter.get("/tasks/:id",auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id,owner: req.user._id})
            if(!task){
                return res.status(404).send()
            }
            res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

      
taskrouter.patch("/tasks/:id",auth,async(req,res)=>{
    const _id = req.params.id
    const toUpdate = Object.keys(req.body)
    const allowedparam = ["description","complete"]
    const isValidated = toUpdate.every((item)=>allowedparam.includes(item))
    if(!isValidated){
        return res.status(400).send({error:"Invalid Update"})
    }
    try{
        // const task = await Task.findById(_id)
        // toUpdate.forEach((item)=>task[item] = req.body[item])
        // await task.save()
        const task = await Task.findOne({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send({error:"task dosent exist"})
        }
        toUpdate.forEach((item)=>task[item] = req.body[item])
        await task.save()

        

        // const task = await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
       
        res.send(task)
    }catch(e){
        res.status(400).send({error:e})
    }
})

taskrouter.delete("/tasks/:id",auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const task = await Task.findOneAndDelete({_id,owner:req.user._id})
        if(!task){
            res.status(404).send({error:"Task not found"})
        }
        res.send(task)
        
    }catch(e){
        res.status(400).send({error:e})
    }
    
})


module.exports = taskrouter