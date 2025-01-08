import mongoose from "mongoose";


const PhotoSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    uploaded_file_link:{
        type:String
    },
    file_description:{
        type:String
    }
})

export const Photo=mongoose.model("Photo",PhotoSchema)