import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.configDotenv()

const connection = () => {
    mongoose.connect(process.env.DB_HOST)
.then(()=>{
    console.log(`Database Connected`)
})
.catch((error)=>{
    console.log(error)
    console.log("Database Connection Failed")
    process.exit(1);
});
}

export default connection


