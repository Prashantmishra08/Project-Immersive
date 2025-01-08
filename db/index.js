import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

const connectDB = async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGO_DB_URI}/${process.env.DB_NAME}` )
        console.log("HURRAY DB is Connected")
    }
    catch(error){
        console.log("error",error)

    }
}

export default connectDB