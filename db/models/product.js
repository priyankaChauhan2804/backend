const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId;

let productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ["Electronics","Computers","MobilePhones","Clothes"],
        required: true
    },
    imgUrl: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const productModel = mongoose.model("Product",productSchema);

module.exports = productModel