const express = require("express")
const mongoose = require("mongoose")
const User  = require("../models/user")
const router = new express.Router()
const auth = require("../middleware/auth")
const multer =  require("multer")




router.post("/users",async(req,res)=>{
    const user1 = new User(req.body)
    try{
        await user1.save()
        const token = await user1.generateAuthTokens()
        res.status(201).send({user1,token})
    }catch(e){
        res.status(400).send(e)
    }
    
    // user1.save().then(()=>{
    //     res.status(201).send(user1)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })

})

router.post("/users/login",async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthTokens()
        // res.send({user:user.getPublicProfile(),token})
        res.send({user,token})
    }catch(e){
        res.status(400).send({error:e})

    }
})

router.post("/users/logout",auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((element)=>{
            return element.token !== req.token
        })
        await req.user.save()
        res.send()

    }catch(e){
        res.status(500).send({error:e})
    }
})

router.post("/users/logoutall",auth,async(req,res)=>{
    try{
        req.user.tokens = []
        
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send({error:e})
    }
    
})

router.get("/users/me",auth,async(req,res)=>{
    try{
        res.send(req.user)
        // const users = await User.find({})
        // res.send(users)
    }catch(e){
        res.status(500).send()

    }
    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch(()=>{
    //     res.status(500).send()

    // })

})

router.get("/users/:id",async(req,res)=>{
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
            res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
    // User.findById(req.params.id).then((user)=>{
    //     if(!user){
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

router.get("/users/:name",async(req,res)=>{
    const _name = req.params.name
    console.log(_name)
    try{
        const user1 = User.findOne({name:_name})
            if(!user1){
                return res.status(404).send()
            }
            res.send(user1)
        }catch(e){
            res.status(500).send(e)
        }
    
    // User.findOne({name:_name}).then((user)=>{
    //     if(!user){
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

router.patch("/users/me",auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    // console.log(updates)
    const allowedupdate = ["name","email","password","age"]
    const isValidOperation = updates.every((update)=> allowedupdate.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error:"Invalid Update!"})
    }
    try{
        // const user = await User.findById(req.params.id)
        updates.forEach((update)=>req.user[update] = req.body[update])
            await req.user.save()
    
        // const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        // if(!user){
        //     return res.status(404).send({error:"user dosent exist"})
        // }
        res.send(req.user)
    }catch(e){
        res.status(400).send({error:e})
    }
})


router.delete("/users/me",auth,async(req,res)=>{
    // const _id = req.params.id
    try{
        // const user = await User.findByIdAndDelete(_id)
        // if(!user){
        //     return res.status(404).send({error:"User not found"})
        // }
        req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(400).send({error:e})
    }
})

const upload = multer({
    // dest:"avatars",
    limits:{
        fileSize:1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error ("Please upload file of specified format"))
        }
        cb(undefined,true)
    }
})

router.post("/users/me/avatar",auth,upload.single("avatar"),async(req,res)=>{
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete("/users/me/avatar",auth,upload.single("avatar"),async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

module.exports  = router
