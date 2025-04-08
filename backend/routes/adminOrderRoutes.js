const express = require('express')
const Order = require('../models/Order')
const {protect,admin} = require ('../middleware/authMiddleware')

const router =express.Router()

// get /api/admin/orders

router.get('/',protect,admin,async (req,res) =>{
    try {
        const orders = await Order.find({}).populate('user','name email')
        res.json(orders)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:'Server Error'})
    }
})
// put /api/admin/ordrs/:id
router.put('/:id', protect, admin, async (req, res) => {
    try {
        console.log("Order ID:", req.params.id);  // Debugging

        const order = await Order.findById(req.params.id).populate("user","name");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = req.body.status || order.status;
        order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered;
        order.deliveredAt = req.body.status === "Delivered" ? new Date() : order.deliveredAt; // ✅ FIXED!

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Server Error" });
    }
});
// delete /api/admin/orders/:id
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.json({ message: "Order removed" });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports =router;