import mongoose from "mongoose"
import {DB_NAME} from "../Frontend/constant.js" 
const connectDB = async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGOOSEDB_URL}/${DB_NAME}`)
        console.log("HURRAY DB is Connected")
    }
    catch(error){
        console.log("error",error)

    }
}

export default connectDB
