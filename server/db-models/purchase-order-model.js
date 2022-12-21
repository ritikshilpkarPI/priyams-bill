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
            paidAmount : Number,
            paidBy:String,
            chequeNumber:String,
        }
    ],
    billPhotos:[{
        public_id:String,
        secure_url:String
    }],
    billAmount:Number,
    remark:String,
    totalPaidAmount:String,
    payment:String,
    procurementSource:String,
    dealerName:String,
    phoneNumber:Number,
    isDraft:Boolean,
    isApproved:{
        type:Boolean,
        default : false
    },
    isRejected:{
        type:Boolean,
        default:false
    }
})

// pre hook to make is Approved true or false if approver is their

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema)