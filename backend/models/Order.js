const mongoose = require("mongoose")
const Product = require("./Product")

const orderItemSchema  = new mongoose.Schema({
    ProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required: true,
    },
    name :{
        type: String,
        required: true,
    },
  image:  {
        type: String,
        required: true,
    },
   price: {
        type: String,
        required: true,
    },
    size: String,
    color: String,
    quantity:{
        type: Number,
        required: true,
    },
},
{_id: false}
)

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },

    orderItems: [orderItemSchema],
    shippingAddress: {
        address: {type:String,required: true},
        city: {type:String,required: true},
        postalCode: {type:String,required: true},
        country: {type:String,required: true},
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["payPal", "stripe"],
    },
    totalPrice:{
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    PaidAt: {
        type: Date,
        default: false,
    },
    isDelivered: {
        type: Boolean,
        default: false,
    },
    deliveredAt: {
        type: Date,
        default: false,
    },
    paymentStatus: {
        type: String,
        default: 'Pending',
    },

    status: {
        type: String,
        enum: ["Processing","Shipped","Delivered","Cancelled"],
        default:"Processing",
    }
},
{timestamps: true}
)

module.exports =mongoose.model("order",orderSchema)