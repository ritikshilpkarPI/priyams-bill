const mongoose = require("mongoose");


const purchaseOrderSchema = new mongoose.Schema({
    purchasedItems: [
        {
            barcode: String,
            inputName: String,
            stockQuantity: Number,
            minimumQuantity: Number,
            itemQuantity: Number,
            unit: String,
            procurementSource: String,
            dealerName: String,
            phoneNumber: String,
            itemRemark: String,
            bill_photo: {
                id: String,
                secure_url: String
            },
            sellingPrice: Number,
            mrp: String,
            costPrice: Number,
            createdAt: Date.now,
            expiryDates: [
                { date: Date }
            ]
        }
    ],
    payment: String,
    billAmount: Number,
    paidAmount: Number,
    paidBy: String,
    paymentDate: Date.now
})

// pre hook to make is Approved true or false if approver is their

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema)