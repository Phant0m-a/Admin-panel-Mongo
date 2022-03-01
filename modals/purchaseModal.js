const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const schema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    totalPrice:{
        type:Number,
        default:0
    },
    products:[{
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        price:{
            type:Number,
            required:true
        },
        // date:{
        //     type:Timestamp,
        //    default:Date
        // }
    }]

});

const PurchaseModal = mongoose.model("Purchase", schema);
module.exports = PurchaseModal;