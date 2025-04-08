const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

//  Create a New Product (POST /api/products)
router.post('/', protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;

        const product = new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user._id, // Reference to the admin user who created it
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.put("/:id", protect, admin, async (req, res) => {
    try {
        // Find the product by ID
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update only the provided fields
        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        product.discountPrice = req.body.discountPrice || product.discountPrice;
        product.countInStock = req.body.countInStock || product.countInStock;
        product.category = req.body.category || product.category;
        product.brand = req.body.brand || product.brand;
        product.sizes = req.body.sizes || product.sizes;
        product.colors = req.body.colors || product.colors;
        product.collections = req.body.collections || product.collections;
        product.material = req.body.material || product.material;
        product.gender = req.body.gender || product.gender;
        product.images = req.body.images || product.images;
        product.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : product.isFeatured;
        product.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : product.isPublished;
        product.tags = req.body.tags || product.tags;
        product.dimensions = req.body.dimensions || product.dimensions;
        product.weight = req.body.weight || product.weight;
        product.sku = req.body.sku || product.sku;

        // Save the updated product to MongoDB
        const updatedProduct = await product.save();

        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});



router.delete("/:id", protect, admin, async (req, res) => {
    try {
        // Find the product by ID
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        //  Remove the product from DB
        await product.deleteOne();

        res.json({ message: "Product removed" });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: "Server Error" });  
    }
});

router.get("/", async (req,res) => {
    try {
        const {
        collection,size,color,gender,minPrice, maxPrice,sortBy,
        search,category, material,brand,limit
        } = req.query

        let query ={}
        // filter logic
        if (collection && collection.toLocaleLowerCase() !=='all'){
            query.collections =collection
        }

        if (category && category.toLocaleLowerCase() !=='all'){
            query.category =category
        }
        if(brand) {
            query.brand = {$in: brand.split(',')}
        }

        if(size) {
            query.sizes = {$in: size.split(',')}
        }

        if(color){
            query.colors ={ $in : [color]}
        }

        if(gender){
            query.gender =gender
        }

       if (minPrice || maxPrice) {
        query.price = {}
        if (minPrice) query.price.$gte = Number(minPrice)
        if (maxPrice) query.price.$lte =Number(maxPrice)    
       }

        
       if (search) {
        query.$or= [{name: {$regex: search,$options:'i'}},{description:{$regex:search,$options:'i'}}]
       }

       //sort logic
       let sort ={}
      if (sortBy) {
        switch (sortBy) {
            case 'priceAsc':
                sort = {price:1}
                break
            case 'priceDesc':
                sort={price:-1}
                break
            case 'popularity':
                sort={rating: -1}
                break    
                default:
                break    
        }
      } 
     // fetch products and apply sorting
     let products =await Product.find(query)
       .sort(sort)
       .limit(Number(limit)||0)
     res.json(products)  

    } catch (error) {
        console.error(error)
        res.status(500).send('server error')
    }
})


// get /api/products/best-seller
router.get("/best-seller",async (req,res) =>{
    try {
        const bestSeller = await Product.findOne().sort({ rating:-1})
        if (bestSeller) {
            res.json(bestSeller)
        } else {
            res.status(404).json({message: "No best seller found"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }
})


// get/api/products/new-arrivals
router.get("/new-arrivals",async (req,res) =>{
    try {
        //fetch products
        const newArrivals = await Product.find().sort({ createAt: -1}).limit(8)
        res.json(newArrivals)
    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }
})

// get/api/products
router.get("/:id",async (req,res) =>{
    try {
        const product = await Product.findById(req.params.id)
        if (product) {
            res.json(product)
        } else {
            res.status(400).json({message:"Product Not Found"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }
})

// get /api/product/similar/:id
router.get("/similar/:id",async (req,res) =>{
    const {id} = req.params
    
    try {
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({message:'Product not found'})
        }

        const similarProducts = await Product.find({
            _id:{$ne:id},
            gender: product.gender,
            category: product.category,
        }).limit(4)

        res.json(similarProducts)
    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }
})



module.exports = router;
