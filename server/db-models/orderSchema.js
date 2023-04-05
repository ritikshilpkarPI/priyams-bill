import mongoose from "mongoose";

export const orderSchema = new mongoose.Schema({
  
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cart",
    },
    orderNumber: {
        type: String,
        required: false,
    },
    orderDate: {
        type: Date,
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['orderplaced', 'pending', 'confirmed', 'dispatched']
    },
    orderItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: false,
            },
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },

   
    totalQuantity: {
        type: Number,
        required: false,
    },
    shippingAddress: {
        address: {
            type: String,
            required: true,
        },
        
    },
    contactNumber: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: false,
    },
    paymentStatus: {
        type: String,
        required: false,
    },
    paymentId: {
        type: String,
        required: false,
    },
    totalMRPAmount: {
        type: Number,
        required: false,

    },
    discountPercentage: {
        type: Number,
        required: false,
    },
    discountAmount: {
        type: Number,
        required: false,
    },
    totalPayableAmount: {
        type: Number,
        required: true,
    },
    timeSlot: {
        type: String,
        required: true,
    },
    
        
  
});



export const Order = mongoose.model("order", orderSchema);
