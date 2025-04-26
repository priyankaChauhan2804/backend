let {validationResult} = require('express-validator')
let productModel = require('../db/models/product')
let mongoose = require("mongoose");

let ObjectId = mongoose.Types.ObjectId

// let products = [
//     {
//         id: 1,
//         name: "Air Conditioner",
//         desc: "Cools down the environment",
//         price: 35000,
//         category: "Electronics",
//         imgUrl: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR-j9cKfTN97dkM7GPsjA8uqh_B-Fj9Nd3IAhU1hciwsinDMwJug4BGm31GaY7Fge2Mmb5VWBk_VHTTtHdPCmyqcI3VJS2IyM6UuwQRBG32XzyOmFXvWe5Tyg"
//     },{
//         id: 2,
//         name: "Trophy for RCB",
//         desc: "RCB Wins",
//         price: 999999999999.99,
//         category: "IPL",
//         imgUrl: "https://bsmedia.business-standard.com/_media/bs/img/article/2024-03/22/full/1711089108-3549.jpg"
//     }
// ]

let getAllProducts = async (req,res)=>{
    let skip = req.query.skip || 0;
    let limit = req.query.limit || 5;
    let category = req.query.category;
    let minPrice = req.query.minPrice;
    let maxPrice = req.query.maxPrice;
    let query = {}
    if(category && category != "") {
        query["category"] = category
    }
    if((minPrice && minPrice > 0) || (maxPrice && maxPrice > 0) ) {
        if(minPrice && maxPrice  && minPrice > maxPrice) {
            return res.status(400).json({success:false,message:"minPrice can't get greater than maxPrice"})
        }
        if(minPrice && maxPrice) {
            query["price"] = {$and: [{$gte:minPrice},{$lte:maxPrice}]}
        }
        else if(minPrice && !maxPrice) {
            query["price"] = {$gte:minPrice}
        }
        else if(maxPrice && !minPrice) {
            query["price"] = {$lte:maxPrice}
        }
    }
    let allProducts = await productModel.find(query).skip(skip).limit(limit);
    res.status(200).json({success:true,message:"Products fetched successfull",data:allProducts})
}

let getProductById = async (req,res)=>{
    var productId = req.params.id;
    // let product = await productModel.find({_id:new ObjectId(productId)})
    let product = await productModel.findById(productId)
    if(!product) {
        res.status(404).json({success:false,"message":"Product not found"})
    }
    res.status(200).json({success:true,message:"Product fetched successfull",data:product})
}

let createProduct = async(req,res)=>{
    try {
        let body = req.body;
        // let error = validateProduct(body);
        const errors = validationResult(req);
        if(errors && errors.length) {
            console.log(errors)
        }
        let product = new productModel({
            name: body.name,
            desc: body.desc,
            price: body.price,
            category: body.category,
            imgUrl: body.imgUrl
        })
        await product.save()
        res.status(201).json({success:true,message:"Product Created successfully"});
    }
    catch(err) {
        res.status(400).json({success:false,message:err.message});
    }
}

let updateProduct = async(req,res)=>{
    let productId = req.params.id;
    let newDesc = req.body.desc;
    let newPrice = req.body.price;
    let product = await productModel.findById(productId)
    if(newDesc && newDesc != "")
    {
        product.desc = newDesc
    }
    if(newPrice && newPrice > 0)
    {
        product.price = newPrice
    }
    await product.save()
    res.status(200).json({success:true,message:"Product Updated successfully"})
}

let deleteProdut = async(req,res) => {
    let productId = req.params.id;
    await productModel.deleteOne({_id:new ObjectId(productId)})
    res.status(200).json({success:true,message:"Product Deletd successfully"})
}

let validateProduct = (product)=> {
    if(!product) {
        throw new Error("Please pass a valid product")
    }
    if(!product.name || !product.id || !product.desc || !product.category) {
        throw new Error("Required feilds are Missing")
    }
    if(isNaN(product.id)) {
        throw new Error("id must be a number")
    }
    return false;
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProdut
}