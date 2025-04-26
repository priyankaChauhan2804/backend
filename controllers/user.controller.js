const bcrypt = require('bcryptjs');
let {validationResult} = require('express-validator')
let {v4: uuid} = require('uuid');
const users = require('../db/models/user');
const jwt = require('jsonwebtoken');
const { use } = require('../routes/user.router');
let siginUser = async (req,res) => {
    let errors = validationResult(req);
    let body = req.body;
    if(errors && errors.length) {
        res.status(400).json({success:false,message:errors[0].message})
    }

    if(!body || !body.email || !body.password) {
        return res.status(400).json({success: false, message: "PLease check credentials"})
    }
    query = {
        email: body.email
    }
    console.log(query)
    let user = await users.findOne(query);
    if(!user && Object.keys(users).length == 0){
        return res.status(404).json({success:false,message:"User not found"})
    }
    const isPasswordMatched = await bcrypt.compare(body.password, user.password);
    if(!isPasswordMatched) {
        return res.status(404).json({success:false,message:"Password incorrect"})
    }
    const payload = {
        userId: user._id,
        type: user.type || 0,
        name: user.name   
    }
    const tokenSecret = process.env.TOKEN_SECRET
    jwt.sign(payload, tokenSecret,{
        expiresIn: 3600
    }, (err, token) => {
        if(err) {
            return res.status(500).json({success: false, message: "Internal server error"})
        }
        res.json({success: true, token: token})
    })
    
}

let signUpUser = async (req, res)=> {
    let errors = validationResult(req);
    let body = req.body;
    if(errors && errors.length) {
        res.status(400).json({success:false,message:errors[0].message})
    }
    let existingUser = await users.findOne({
        email: body.email
    })
    if(existingUser && Object.keys(existingUser).length) {
        return res.status(404).json({success:false,message:"User already signed up"})
    }

    const salt = await bcrypt.genSalt(11);
    console.log(body)
    let newUser = {
        name: body.name,
        email: body.email,
        password: await bcrypt.hash(body.password, salt),
        phone: body.phone
    }
    await users.insertOne(newUser);
    return res.status(200).json({success:true,message:"User signedup successfully"})
}

let updateUser = (req, res)=> {
    let userId = req.params.id;
    let userIndex = -1;
    let user = users.find((u,idx)=>{
        userIndex = idx;
        return u.id == userId;
    })
    if(!userId) {
       return res.status(404).json({success:false,"message":"user not found"})
    }
    let newPhone = req.body.phone;
    let newName = req.body.name;
    let updatedUser = {...user}
    if(newName && newName != "")
    {
        updatedUser.name = newDesc
    }
    if(newPhone && newPhone != "")
    {
        updatedUser.phone = newPrice
    }
    users[userIndex] = updatedUser
    res.status(200).json({success:true,message:"User Details Updated successfully"})
}

let deleteUser = ()=>{
    let userId = req.params.id;
    users = users.filter(u=>{
        return u.id != userId
    })
    res.status(200).json({success:true,message:"User Deletd successfully"})
}

module.exports = {
    siginUser,
    signUpUser,
    updateUser,
    deleteUser
}