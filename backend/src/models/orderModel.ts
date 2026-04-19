import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true
    },
    orderQuantity: {
        type: Number,
        required: true,
    },
    orderStatus: {
        type: Number,
        required: true,
        enum: [0,1,2],
    },
    email: {
        type: String,
        required: true,
    },
    dateOrdered: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true
    }
});