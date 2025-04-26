const express = require('express');
const {check } = require('express-validator')
const {createOrder, getAllOrder, getAllUserOrder, updateOrder, deleteOrder} = require('../controllers/order.controller')
const isAdmin = require("../middleware/isAdmin");
const auth = require("../middleware/auth");
const { models } = require('mongoose');
const orderRouter = express.Router();

orderRouter.post("/", [
    check("itemList").not().isEmpty(),
    check("address").not().isEmpty(),
    check("paymentMethod").not().isEmpty(),
    auth], createOrder)

orderRouter.get("/", isAdmin,getAllOrder);
orderRouter.get("/user/orders", auth, getAllUserOrder)
orderRouter.patch("/:id", isAdmin, updateOrder);
orderRouter.delete("/:id", isAdmin, deleteOrder)


module.exports = orderRouter;