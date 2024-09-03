import express from 'express'
import dotenv  from 'dotenv' 
import connection from './db.js'
import paymentRouter from './app/routes/payment.route.js';

dotenv.configDotenv()

connection()
const app = express()
app.use(express.json())
app.listen(process.env.PORT,()=>{
    console.log('Server is Running');
})

app.use("/payment",paymentRouter);

