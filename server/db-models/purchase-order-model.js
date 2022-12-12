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
            itemRemark: String,
            sellingPrice: Number,
            mrp: String,
            costPrice: Number,
            createdAt: { type: Date, default: Date.now },
            expiryDates: [
                { date: Date }
            ],
            slabPrice:[{
                startValue:Number,
                endValue:Number,
                pricing:Number,
            }]
        }
    ],
    purchaseDetails:[
        {
            payment: String,
            billAmount: Number,
            paidAmount : Number,
            remark : String,
            paidBy:String,
            procurementSource:String,
            dealerName:String,
            phoneNumber:Number,
            chequeNumber:String,
        }
    ],
    billPhotos:[],
    isSaved:false,
    isDraft:false
})

// pre hook to make is Approved true or false if approver is their

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema)