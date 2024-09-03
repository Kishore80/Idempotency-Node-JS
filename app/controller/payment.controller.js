import paymentModel from "../model/payment.model.js";
import __ from "../../helpers/globalFunctions.js";
import initiateConnection from '../../helpers/redis.js'
import { Redis } from '@upstash/redis';
import { v4 as uuidv4 } from 'uuid';

//Redis Connection
const redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
});

class payments {
    generateUuid = async (req,res) => {
        try {
            let checkPaymentTable = await paymentModel.findOne({
                userId:req.body.userId,
                status:0
            })
            if(checkPaymentTable){ //Generate Pending Impotent Key
                return __.out(res,200,checkPaymentTable.idempotentKey);
            }else{
                let generatenewId = uuidv4(); 
                let createNewIdempotentKeyInRedis = await redis.set(generatenewId,0)
                return __.out(res,200,generatenewId);
            }
        } catch (error) {
            console.log('error',error);
            return __.out(res,500,'Internal Server Error Occured')
        }
    }
    createPayment = async (req,res) => {
        try {
            let iKey = req.body.iKey;
            let checkRedis = await redis.get(iKey)
            if(checkRedis == null){
                return __.out(res,200,"Invalid Request")
            }else{
                if(checkRedis == 0){
                    //Depending on the Business Use Case , We can develop the Logic Here
                    return __.out(res,200,"This is where the backend will invoke the Pending Payment Internally in the Backend")
                }else{
                    //Return the Payment Status
                    return __.out(res,200,`Your Payment is ${checkRedis == 1 ? "Failed" : "Success"}`); 
                }
            }        
        } catch (error) {
            console.log(error)
            return __.out(res,500,'Internal Server Error'); 

        }
    }
    updatePaymentStatus = async (req,res)=>{
        try{
            let iKey = req.body.iKey;
            let userId = req.body.userId;
            let status = req.body.status;
            //In real time , this logic will be Updated using the PSP Response.
            let updatePaymentTable = await paymentModel.updateOne({
                idempotentKey:iKey,
                userId:userId
            },{
                $set:{
                    status : status
                }
            })

            //Update the Value in Redis As well.
            let updateRedis = await redis.set(iKey,status);
            return __.out(res,200,"Payment Status Updated")
        }catch(error){
            console.log(error)
            return __.out(res,500,'Internal Server Error'); 

        }
    }
}

payments = new payments()
export default payments;