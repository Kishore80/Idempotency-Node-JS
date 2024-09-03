import mongoose, { Schema } from "mongoose";

const paymentSchema = new mongoose.Schema({
    amount:{
        typ:Number
    },
    userId:{
        type:String,
    },
    status:{
        type:Number,
        default:0 //1 - Success 2 - Failed
    },
    idempotentKey:{
        type:String,
        unique:true
    }
},{
    timestamps:true
});

export default mongoose.model('payment',paymentSchema)
