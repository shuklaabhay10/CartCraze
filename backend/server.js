const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscribeRoutes = require("./routes/subscribeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 9000;

app.get("/", (req, res) => {
    res.send("Welcome to API");
});

app.post("/api/create-checkout-session", async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ error: "No products provided." });
        }

        const lineItems = products.map((product) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: product.name,
                    images: product.image ? [product.image] : [], // Avoid null images
                },
                unit_amount: Math.round(product.price * 100), // Convert price to cents
            },
            quantity: product.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:5173/",
            cancel_url: "http://localhost:5173/cancel",
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("🔥 Stripe Error:", error); // LOG THE ERROR
        res.status(500).json({ error: error.message }); // Send real error message
    }
});

app.post('/api/subscribe', async (req, res) => {
    try {
      const { email } = req.body;
  
      // Save to your MongoDB collection
      const newSub = new Subscriber({ email });
      await newSub.save();
  
      res.status(200).json({ message: 'Subscribed successfully!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Subscription failed' });
    }
  });
  
// ✅ API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", subscribeRoutes);

// ✅ Admin Routes
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
