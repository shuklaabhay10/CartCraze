const Product = require("./models/Product");
const User = require("./models/User");
const products = require("./data/products");
const mongoose = require("mongoose");
const Cart = require ("./models/Cart")
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Connection Error:", err));

const seedData = async () => {
    try {
        // Clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();


        // Create a default admin user
        const createUser = await User.create({
            name: "Admin User",
            email: 'admin@example.com',
            password: "123456",
            role: 'admin',
        });

        // ✅ Corrected variable name
        const userID = createUser._id;

        // Assign user ID to each product
        const sampleProducts = products.map((product) => ({
            ...product,
            user: userID,
        }));

        // ✅ Insert the products into the database
        await Product.insertMany(sampleProducts);

        console.log("✅ Product data seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding error:", error);
        process.exit(1);
    }
};

seedData();
