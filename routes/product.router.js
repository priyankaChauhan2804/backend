const express = require("express");
const {getAllProducts, getProductById, createProduct, updateProduct, deleteProdut} = require('../controllers/product.controller')
const { check } = require('express-validator')
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

let productRouter = express.Router();

productRouter.get("/", getAllProducts)

productRouter.get("/:id",getProductById)

productRouter.post("/",[
    check('id').not().notEmpty(),
    check('name').isLength({min:5})
],isAdmin,createProduct)

productRouter.patch("/:id",[isAdmin],updateProduct)

productRouter.delete("/:id",isAdmin,deleteProdut)

module.exports = productRouter;