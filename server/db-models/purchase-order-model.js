const mongoose = require("mongoose");


const purchaseOrderSchema = new mongoose.Schema({
    barcode: String,
    brandName: String,
    itemName: String,
    category: String,
    unit: {
        type: String,
        enum: ["kg", "grams", "litre", "ml", "piece"]
    },
    expiryDate: [{ type: Date }],
    costPrice: Number,
    sellingPrice: Number,
    modeOfPayment: {
        type: String,
        required: true
    },
    doneBy: String,
    amount: Number,
    approver: {
        type: String
    },
    isApproved: Boolean,
    remark: String,
    slabPricing: Array,
    itemStockQuantity: { type: Number, default: 0 },
    minimumStockQuantity: { type: Number, default: 1 },
    itemMRPperUnit: { type: Number, required: true, default: 0 },
})

// pre hook to make is Approved true or false if approver is their

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema)