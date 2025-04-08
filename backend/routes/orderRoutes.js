const express = require('express')
const Order = require('../models/Order')
const {protect} = require("../middleware/authMiddleware")

const router = express.Router()
// get /api/orders/my-order
router.get('/my-orders', protect, async (req, res) => {
    try {

        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

        console.log("Orders Found:", orders); // Debugging

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});


// get /api/orders/:id
router.get( '/:id',protect,async (req,res) =>{
    try {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        )
        if (!order){
            return res.status(400).json({message:'Order not found'})
        }
        // return the full order detail
        res.json(order)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'server error'})
    }
})

module.exports = router