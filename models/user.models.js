import mongoose from "mongoose";
 

// User Schema = user data base kesa dikhna chiye and uss mai kon kon se fields honi chaiye
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true, 
        index: true
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        
    },
    password: {
        type: String,
        required: [true, "Password is MUST"]
    },
    profession: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required:true
    },
    avatar: {
        type: String,
        required: true,
    },
    accessToken: {
        type: String
    }
    
})

// User Model
const User = mongoose.model("User", userSchema)
export default User