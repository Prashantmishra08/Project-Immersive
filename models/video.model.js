import mongoose from "mongoose";


const VideoSchema=new mongoose.Schema({
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

export const Video=mongoose.model("Video",VideoSchema)