const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();  // ✅ Correct router declaration

// GET /api/admin/products
router.get('/', protect, admin, async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
