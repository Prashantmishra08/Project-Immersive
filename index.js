import express from "express"
import dotenv from "dotenv"
import User from "./models/user.models.js"
import { Photo } from "./models/photo.model.js"
import Notification from "./models/notification.model.js"
import connectDB from "./db/index.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import upload from "./middlewares/fileuploader.middleware.js"
import video_upload from "./middlewares/video_upload.middleware.js"
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { Video } from "./models/video.model.js"
import fileretreve from "./middlewares/fileretreve.js"
import cors from 'cors'
import cookieParser from "cookie-parser"
import { verifyJwt } from "./middlewares/verifyjwt.js"
import logOutUser from "./controllers/user.controllers.js"
import router from "./middlewares/fileretreve.js"
import video_retreve from "./middlewares/videoretreve.js"
import getUserChannelProfile from "./controllers/followers.controllers.js"
import uploadPost from "./controllers/uploadPost.controller.js"
import getSearchedUserProfile from "./controllers/searchUser.controller.js"
import { updateProfile, updateProfilePicture } from "./controllers/updateProfile.controller.js"
import unfollowUser from "./controllers/followersdecrese.js"
import followUser from "./controllers/followersincrese.js"
import {uploadCreatePost} from "./controllers/uploadcreatepost.controller.js"
import { createPost, getAllPosts, getUserPosts, likePost, commentOnPost } from "./controllers/post.controller.js"
import messageRoutes from "./routes/message.routes.js"
import conversationRoutes from "./routes/conversation.routes.js"
import { app, server } from "./socket/socket.js"
import fileUpload from "express-fileupload"
import Post from "./models/post.model.js"
import Report from "./models/report.model.js"
import protect from "./middlewares/protect.js"
import adminProtect from "./middlewares/adminProtect.js"
import verifyAdmin from "./middlewares/verifyAdmin.js"
import verifyToken from "./middlewares/verifyToken.js"
import { reportPost, reportUser, getReports, deleteReport } from "./controllers/report.controller.js"
import { getUserDetails, getTotalPosts, getFollowersCount, getFollowingCount } from "./controllers/userdetails.controller.js"

// load the .env file 
dotenv.config({ path: './.env' })

// express to handle the route and listening

// const app = express()

// to allow cross-origin access



app.use(cors({
    origin: "http://localhost:5173",  // Allow frontend origin
    credentials: true,                // Allow cookies & authentication headers
}));





// to process the json data(middle-ware)

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use(fileUpload({ useTempFiles: true, limits: { fileSize: 50 * 1024 * 1024 } })); 


// to use the cookies

app.use(cookieParser())

// function which is imported to run the DB connction

connectDB()

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});







// to handle the User registeration
app.post("/api/signup", upload.single("avatar"), async (req, res) => {
    console.log(req.body);
    const { fullName, userName, email, password, profession, about, interests } = req.body;

    if (!password) {
        return res.status(400).send("Password is required");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const avatarLocalPath = req.file.path; // Corrected to req.file
    try {
        const response = await cloudinary.uploader.upload(avatarLocalPath, {
            resource_type: "image"
        });

        // Clean up local file after upload
        if (fs.existsSync(avatarLocalPath)) {
            fs.unlinkSync(avatarLocalPath);
        }

        const parsedInterests = interests ? JSON.parse(interests) : [];

        const uploaded_file_link = response.secure_url;
        const newUser = new User({
            fullName,
            userName,
            email,
            password: hashedPassword,
            profession,
            about,
            avatar:uploaded_file_link,
            interests: parsedInterests, 
        });

        await newUser.save();
        console.log(newUser); // Logging before return to ensure execution
        return res.json({ message: "Form Data Saved" });

    } catch (error) {
        return res.status(500).json({ Error: error.message });
    }
});


// to handle the User login

app.post("/api/login", async (req, res) => {
    const { userName, password } = req.body;

    try {
        // ✅ Normal User Login
        const userFound = await User.findOne({ userName });

        if (!userFound) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, userFound.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ _id: userFound._id, role: "user" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

        console.log("🚀 Generated Token:", token); // ✅ Debugging


        await User.findByIdAndUpdate(userFound._id, { accessToken: token });

        res.status(200)
        .cookie("accessToken", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" })
        .json({
        message: "Login successful",
        token, // ✅ Token bhi return kar rahe hain taaki frontend header me use kar sake
        user: {
            _id: userFound._id,
            userName: userFound.userName,
            email: userFound.email,
            avatar: userFound.avatar,
            role: "user",
        },
    });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


// Admin Login
// const ADMIN_EMAIL = "admin@gmail.com";
// const ADMIN_PASSWORD = "admin";
// app.post("/api/admin/login", async (req, res) => {
  
//   try {
//     const { email, password } = req.body;

//     // ✅ Check if email matches hardcoded admin email
//     if (email !== ADMIN_EMAIL) {
//       return res.status(401).json({ error: "Unauthorized: Invalid admin email" });
//     }

//     // ✅ Check if password is correct
//     const isMatch = password === ADMIN_PASSWORD;
//     if (!isMatch) {
//       return res.status(401).json({ error: "Unauthorized: Invalid password" });
//     }

//     // ✅ Generate JWT Token
//     const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     console.log("JWT_SECRET:", process.env.JWT_SECRET);

//     res.cookie("adminToken", token, { httpOnly: true, secure: false });
//     res.json({ message: "Admin logged in successfully", token });
//   } catch (err) {
//     console.error("Admin Login Error:", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  // Static admin details (change if using a database)
  const adminEmail = "admin@email.com";
  const adminPassword = "pass";

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ message: "Admin logged in", token, admin: { email, role: "admin" } });
});

app.get("/api/auth/me", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.json({
        user: {
          id: "admin_id",
          role: "admin",
          email: "admin@example.com",
        },
      });
    }

    const user = await User.findById(req.user.id).select("-password"); // Remove password for security
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// cloudinary configuration for file uploaing on clouds




// file uploading function with middledware of multer names as upload
  
// app.post("/api/upload/image",verifyJwt, upload.single("file"), async (req, res) => {
//     const localFilePath = req.file.path
//     const { file_description } = req.body

//     try {
//         const user = req.user; 
//         if (!user) {
//             return res.status(400).send("User not found");
//         }
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "image"
//         });

//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath) 
//         }

//         const uploaded_file_link = response.secure_url
//         const final_data = new Photo({
//             user:user._id, 
//             uploaded_file_link,
//             file_description
//         });

//         await final_data.save()
        
//         console.log(final_data)

//         return res.json({ message: "file uploaded sucessfully" })
//     } catch (error) {
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath)
//         }

//         console.log(error)
//         return res.status(500).send("File upload failed")
//     }
// })

// app.post("/api/upload/video",verifyJwt, video_upload.single("file"), async (req, res) => {
//     const localFilePath = req.file.path
//     const { file_description } = req.body

//     try {
//         const user = req.user; 
//         if (!user) {
//             return res.status(400).send("User not found");
//         }
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "video"
//         });

//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath) 
//         }

//         const uploaded_file_link = response.secure_url
//         const final_data = new Video({
//             user:user._id, 
//             uploaded_file_link,
//             file_description
//         });

//         await final_data.save()
        
//         console.log(final_data)

//         return res.json({ message: "file uploaded sucessfully"})
//     } catch (error) {
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath)
//         }

//         console.log(error)
//         return res.status(500).send("File upload failed")
//     }
// })

// app.post("/api/upload/image", async (req, res) => {
//     try {
//       console.log("Incoming Request:", req.body, req.files);
  
//       const { userId, username, profilePic, caption, fileType } = req.body;
//       const file = req.files?.file;
  
//       if (!file) {
//         return res.status(400).json({ message: "No file provided" });
//       }
  
//       console.log("Uploading to Cloudinary...");
//       const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath, {
//         folder: "uploads",
//       });
  
//       console.log("Upload Successful:", uploadedFile.secure_url);
  
//       // Create Post in Database
//       const newPost = new Post({
//         userId,
//         username,
//         profilePic,
//         postImage: uploadedFile.secure_url,
//         fileType,
//         caption,
//       });
  
//       await newPost.save();
  
//       res.status(201).json({
//         success: true,
//         message: "File uploaded and post created successfully",
//         post: newPost,
//       });
//     } catch (error) {
//       console.error("Upload/Post Error:", error);
//       res.status(500).json({ message: "File upload & post creation failed", error: error.message });
//     }
//   });
  
//   // ✅ Upload Video Route
//   app.post("/api/upload/video", verifyJwt, video_upload.single("file"), async (req, res) => {
//     if (!req.file) return res.status(400).json({ message: "File is required" });
  
//     try {
//       const localFilePath = req.file.path;
//       const { file_description } = req.body;
//       const user = req.user;
//       if (!user) return res.status(401).json({ message: "Unauthorized" });
  
//       const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "video" });
  
//       if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
  
//       const uploaded_file_link = response.secure_url;
//       res.json({ message: "File uploaded successfully", uploaded_file_link });
//     } catch (error) {
//       res.status(500).json({ message: "File upload failed", error: error.message });
//     }
//   });

// app.post("/api/upload/image", verifyJwt, upload.single("file"), async (req, res) => {
//     const localFilePath = req.file.path;
//     const { caption } = req.body;

//     try {
//         const user = req.user;
//         if (!user) {
//             return res.status(400).send("User not found");
//         }

//         const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "image" });

//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath);
//         }

//         const uploaded_file_link = response.secure_url;

//         // ✅ Create Post in MongoDB
//         const newPost = new Post({
//             userId: user._id,
//             username: user.userName,
//             profilePic: user.profilePic,
//             postImage: uploaded_file_link,
//             fileType: "image",
//             caption: caption,
//         });

//         await newPost.save();

//         return res.json({ message: "Image uploaded and post created successfully", post: newPost });
//     } catch (error) {
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath);
//         }
//         console.log(error);
//         return res.status(500).send("Image upload failed");
//     }
// });


// app.post("/api/upload/video", verifyJwt, video_upload.single("file"), async (req, res) => {
//     const localFilePath = req.file.path;
//     const { caption } = req.body;

//     try {
//         const user = req.user;
//         if (!user) {
//             return res.status(400).send("User not found");
//         }

//         const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "video" });

//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath);
//         }

//         const uploaded_file_link = response.secure_url;

//         // ✅ Create Post in MongoDB
//         const newPost = new Post({
//             userId: user._id,
//             username: user.userName,
//             profilePic: user.profilePic,
//             postImage: uploaded_file_link,
//             fileType: "video",
//             caption: file_description,
//         });

//         await newPost.save();

//         return res.json({ message: "Video uploaded and post created successfully", post: newPost });
//     } catch (error) {
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath);
//         }
//         console.log(error);
//         return res.status(500).send("Video upload failed");
//     }
// });


// app.post("/api/upload-and-create", verifyJwt, async (req, res) => {
//   try {
//       console.log("Incoming File:", req.files);
//       console.log("Request Body:", req.body);

//       // ✅ Fetch user details from authentication middleware
//       if (!req.user) {
//           return res.status(401).json({ message: "Unauthorized: User not authenticated" });
//       }

//       const { profilePic, caption } = req.body;
//       const file = req.files?.file;

//       if (!file) {
//           return res.status(400).json({ message: "No file provided" });
//       }

//       console.log("Uploading to Cloudinary...");
//       const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath, {
//           folder: "uploads",
//       });

//       console.log("Upload Successful:", uploadedFile.secure_url);

//       // 🟢 Create Post in MongoDB
//       const newPost = new Post({
//           userId: req.user.id,         // ✅ Get userId from req.user
//           username: req.user.userName, // ✅ Get username from req.user
//           profilePic: req.user.profilePic || profilePic, // ✅ Use profilePic from DB if available
//           postImage: uploadedFile.secure_url,
//           fileType: file.mimetype.startsWith("image") ? "image" : "video",
//           caption,
//       });

//       await newPost.save();

//       res.status(201).json({
//           success: true,
//           message: "Post created successfully",
//           post: newPost,
//       });
//   } catch (error) {
//       console.error("Error Details:", error); // 🔍 Logs full error
//   res.status(500).json({ message: "Something went wrong!", error: error.message });
//   }
// });

app.get("/api/tags", async (req, res) => {
  const tags = [
    "Technology", "Programming", "Coding", "Software Development", "Web Development",
    "Frontend", "Backend", "Full Stack", "DevOps", "Cloud Computing", "Cybersecurity",
    "Artificial Intelligence", "Machine Learning", "Data Science", "Blockchain", "Cryptocurrency",
    "UI/UX Design", "Mobile Development", "Open Source", "Startup", "Freelancing",
    "Computer Science", "Networking", "Operating Systems", "Gaming", "Competitive Programming",
    "JavaScript", "Python", "React", "Node.js", "MongoDB", "SQL", "C++", "Java",
    "AI Ethics", "Tech News", "Hacking", "Software Engineering", "Debugging", "APIs",
    "Automation", "Internet of Things", "Robotics", "Quantum Computing", "Linux",
    "Science", "Physics", "Mathematics", "Entrepreneurship", "Productivity",
    "Sports", "Music", "Travel", "Food", "Entertainment"
  ];
  res.json(tags);
});


app.get("/api/user/profile", verifyJwt, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Ensure req.user exists
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


app.post("/api/upload-and-create", verifyJwt, fileUpload({
  useTempFiles: true,
  limits: { fileSize: 50 * 1024 * 1024 }
}), uploadCreatePost);






// Post APIs Endpoints

app.post("/api/create", verifyJwt, createPost); // Create Post

app.get("/api/all", getAllPosts); // Fetch All Posts

app.get("/api/user/:userId", getUserPosts); // Get User's Posts

app.put("/api/like/:postId", verifyJwt, likePost); // Like Post

app.post("/api/comment/:postId", verifyJwt, commentOnPost); // Comment on Post


// Notification 
app.get("/api/notifications", verifyJwt, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .populate({
        path: "senderId",
        select: "userName avatar", // ✅ FIXED: Correct field names from User Model
      })
      .populate({
        path: "postId",
        select: "postImage caption", // ✅ FIXED: Correct field names from Post Model
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// message function calling on a specific route

app.use("/api/messages",verifyJwt,  messageRoutes)


app.use("/api/conversations", verifyJwt, conversationRoutes)

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }); // Exclude current user
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});


// File retreve function calling on a specific route

app.get('/api/files/images',verifyJwt,router)

app.get('/api/files/videos',verifyJwt,video_retreve)



// logout function calling on a specific route with middle-ware

app.post('/api/logout', verifyJwt, logOutUser)

app.get('/api/userprofile',verifyJwt,getUserChannelProfile)

app.get("/api/searchuserprofile", verifyJwt, getSearchedUserProfile);

app.put("/api/updateprofile", verifyJwt, updateProfile);

app.put("/api/updateprofilepicture", verifyJwt, updateProfilePicture);

app.post('/api/follow',verifyJwt,followUser)

app.post('/api/unfollow',verifyJwt,unfollowUser)


// User Interest APIs

// ✅ API to get most used tags
app.get("/api/most-used-tags", async (req, res) => {
  try {
    const mostUsedTags = await Post.aggregate([
      { $unwind: "$tags" }, // ✅ Convert tags array into separate documents
      { $group: { _id: "$tags", count: { $sum: 1 } } }, // ✅ Count occurrences
      { $sort: { count: -1 } }, // ✅ Sort by highest count
      { $limit: 10 } // ✅ Limit to top 10 tags
    ]);

    res.json(mostUsedTags);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch most used tags" });
  }
});

// ✅ 1️⃣ API to update user interests
app.post("/api/users/interests", verifyJwt, async (req, res) => {
  try {
    const { interests } = req.body;
    const userId = req.user._id; // ✅ Fix: Use `_id` instead of `id`

    if (!Array.isArray(interests)) {
      return res.status(400).json({ error: "Interests must be an array of strings." });
    }

    // ✅ Update interests in DB
    const user = await User.findByIdAndUpdate(userId, { interests }, { new: true });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "Interests updated successfully!", interests: user.interests });
  } catch (error) {
    console.error("Error updating interests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ 2️⃣ Get User Interests
app.get('/api/interests', verifyJwt, async (req, res) => {
    try {
      console.log("Decoded JWT User:", req.user); // ✅ Check JWT user data
      
  
      const userId = req.user._id;
      if (!userId) {
        return res.status(400).json({ error: "Invalid token, userId missing!" });
      }
      
  
      const user = await User.findById(userId).select("interests"); // ✅ Fetch only interests
      
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({ interests: user.interests });
    } catch (error) {
      console.error("Error fetching interests:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});


// ✅ 3️⃣ Update User Interests
app.put("/api/user/interests", verifyJwt, async (req, res) => {
  try {
    const { interests } = req.body;

    // ✅ Fix: Use `_id` correctly
    const user = await User.findByIdAndUpdate(req.user._id, { interests }, { new: true });

    res.json({ message: "Interests updated successfully", interests: user.interests });
  } catch (error) {
    console.error("Error updating user interests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// Search any user

app.get("/api/search", async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
  
      // Find users whose username matches the query (case-insensitive)
      const users = await User.find({ 
        userName: { $regex: query, $options: "i" } 
      }).select("userName avatar _id"); // Fetch only required fields
  
      res.status(200).json({ success: true, users });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Error searching users", error });
    }
  });

app.delete("/api/delete-account", verifyJwt, async (req, res) => {
    try {
        console.log("User attempting to delete:", req.user); // Debugging

        const username = req.user.userName; // 🔴 Check this field
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const deletedUser = await User.findOneAndDelete({ userName: username });

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// retreve all the files of a perticular user

app.post('/api/collections/videos',verifyJwt,async(req,res)=>{
    try {
        const findUser=req.user._id

        const found=await User.findById(findUser)

        if(!found){
            res.status(404).send("User not found")
        }
        const files = await Video.find({user:findUser})
        
       
        const fileResponses = []
        files.forEach(file => {
            fileResponses.push({
                id: file.user,
                url: file.uploaded_file_link,
            })
        })
        const finalData = []
        for (const fileResponse of fileResponses) {
            const userData = await User.findById(fileResponse.id)
            finalData.push({
                userName: userData ? userData.userName : 'Unknown User',
                url: fileResponse.url
            })
        }

        res.json({ success: true, files: finalData })
    } 
    catch (error) {
        console.error("Error fetching files:", error)
        res.status(500).json({ success: false, message: error.message })
    }
})

app.post('/api/collections/images',verifyJwt,async(req,res)=>{
    try {
        const findUser=req.user._id

        const found=await User.findById(findUser)

        if(!found){
            res.status(404).send("User not found")
        }
        const files = await Photo.find({user:findUser})
        
       
        const fileResponses = []
        files.forEach(file => {
            fileResponses.push({
                id: file.user,
                url: file.uploaded_file_link,
            })
        })
        const finalData = []
        for (const fileResponse of fileResponses) {
            const userData = await User.findById(fileResponse.id)
            finalData.push({
                userName: userData ? userData.userName : 'Unknown User',
                url: fileResponse.url
            })
        }

        res.json({ success: true, files: finalData })
    } 
    catch (error) {
        console.error("Error fetching files:", error)
        res.status(500).json({ success: false, message: error.message })
    }
})


// For Admin

app.get("/api/admin/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "userName email avatar");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// Logout

  const blacklistedTokens = new Set(); // Blacklisted tokens ko store karne ke liye

app.post("/api/admin/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  blacklistedTokens.add(token); // Token ko blacklist mein add karna

  res.json({ message: "Admin logged out successfully" });
});

// Middleware to check blacklisted tokens
const checkBlacklistedToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ message: "Token is blacklisted" });
  }
  next();
};

// Isko `verifyAdmin` middleware ke sath bhi use kar sakte ho
app.use(checkBlacklistedToken);

// Delete User
app.delete("/api/admin/users/:id", verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update User Role
app.put("/api/admin/users/:id/role", verifyAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { role });
    res.json({ message: "User role updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/admin/users/:id/ban", verifyAdmin, async (req, res) => {
    try {
      const { banned } = req.body;
      await User.findByIdAndUpdate(req.params.id, { banned });
      res.json({ message: banned ? "User banned" : "User unbanned" });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/admin/posts", verifyAdmin, async (req, res) => {
    
    console.log("Admin Posts API hit ✅"); // ✅ Check if API is called
    // console.log("User from Token:", req.user); // ✅ Token verify ho raha hai ya nahi
    try {
      const posts = await Post.find().populate("userId", "username avatar"); // Populate user details
      console.log("Posts Data:", posts); // Debugging
      res.json(posts);
  } catch (err) {
      console.error("Error fetching posts:", err);
      res.status(500).json({ error: "Server error" });
  }
  });
  
  
  // Delete Post
  app.delete("/api/admin/posts/:id", verifyAdmin, async (req, res) => {
    try {
      const post = await Post.findByIdAndDelete(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      res.json({ message: "Post deleted successfully" });
  } catch (err) {
      console.error("Error deleting post:", err);
      res.status(500).json({ error: "Server error" });
  }
  });
  
  // Block/Unblock Post
  app.put("/api/admin/posts/:id/block", verifyAdmin, async (req, res) => {
    try {
      const { blocked } = req.body;
      await Post.findByIdAndUpdate(req.params.id, { blocked });
      res.json({ message: blocked ? "Post blocked" : "Post unblocked" });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/admin/stats", verifyAdmin, async (req, res) => {
    try {
        console.log("Admin Stats API hit ✅"); // ✅ Check if API is called
        console.log("User from Token:", req.user); // ✅ Check if token is valid

        const usersCount = await User.countDocuments();
        const postsCount = await Post.countDocuments();
        const reportsCount = await Report.countDocuments(); // ✅ Reports count added

        res.json({
            users: usersCount,
            reports: reportsCount, // ✅ Sending reports count instead of banned users
            posts: postsCount
        });
    } catch (err) {
        console.error("Error in /api/admin/stats:", err); // ❌ Log error if any
        res.status(500).json({ error: "Server error" });
    }
});


  app.get('/api/admin/user/details/:userId', verifyAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Fetch user details
      const userDetails = await getUserDetails(userId);
  
      // Fetch total posts, followers and following count
      const totalPosts = await getTotalPosts(userId);
      const followersCount = await getFollowersCount(userId);
      const followingCount = await getFollowingCount(userId);
  
      const result = {
        userDetails,
        totalPosts,
        followersCount,
        followingCount
      };
  
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err });
    }
  });
  

  // User Reports a Post
app.post("/api/reports/post/:postId", protect, reportPost);

// User Reports another User
app.post("/api/reports/user/:userId", protect, reportUser);

// Fetch All Reports (For Admin)
app.get("/api/reports", adminProtect, getReports);

// Delete a Report (Admin Action)
app.delete("/api/reports/:reportId", adminProtect, deleteReport);

// app.get("/api/users", async (req, res) => {
//     try {
//       const users = await User.find({}, "userName fullName email profession about avatar"); // ✅ Fetch only required fields
//       res.json(users);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });

//   app.delete("/api/users/:id", async (req, res) => {
//     try {
//       await User.findByIdAndDelete(req.params.id);
//       res.json({ message: "User deleted successfully" });
//     } catch (err) {
//       res.status(500).json({ message: "Error deleting user" });
//     }
//   });
//   app.post("/api/admin/logout", (req, res) => {
//     res.clearCookie("token"); // Remove auth token (if using cookies)
//     res.json({ message: "Logged out successfully" });
//   });

// listener on specific port on which the server is running

server.listen(process.env.PORT, () => {
    console.log("Server started on port", process.env.PORT)
})