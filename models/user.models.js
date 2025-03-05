import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, index: true },
  userName: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profession: { type: String, required: true },
  about: { type: String, required: true },
  avatar: { type: String, required: true },
  accessToken: { type: String, default: null }, // ✅ Ensures token validity
  interests: { type: [String], default: [] } // ✅ Ensures empty array if no interests
});

const User = mongoose.model("User", userSchema);
export default User;
