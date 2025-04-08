const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {protect} = require('../middleware/authMiddleware')
const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "User already exists" });

        // Create a new user
        user = new User({ name, email, password });
        await user.save();

        // Create JWT payload
        const payload = { user: { id: user._id, role: user.role } };

        // Sign and return the token
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30h" }, (err, token) => {
            if (err) throw err;

            // Send the user and token in response
            res.status(201).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            });
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
});

router.post("/login",async (req,res) =>{
    const {email,password} =req.body

    try {
        //find user by email
        let user = await User.findOne({email})

        if(!user) return res.status(400).json({message:"invalid credentials"})
            const isMatch = await user.matchPassword(password)

        if (!isMatch)
            return res.status(400).json({message:"invalid credentials"})


         // Create JWT payload
         const payload = { user: { id: user._id, role: user.role } };

         // Sign and return the token
         jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30h" }, (err, token) => {
             if (err) throw err;
 
             // Send the user and token in response
             res.json({
                 user: {
                     _id: user._id,
                     name: user.name,
                     email: user.email,
                     role: user.role
                 },
                 token
             });
         });
    } catch (error) {
      console.error(error)
      res.status(500).send("Server Error")       
    }
})

// get/api/user/profile
router.get("/profile",protect,async(req,res) =>{
    res.json(req.user)
})


module.exports = router;
