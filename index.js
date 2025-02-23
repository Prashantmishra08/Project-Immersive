import express from "express"
import dotenv from "dotenv"
import User from "./models/user.models.js"
import { Photo } from "./models/photo.model.js"
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
import getSearchedUserProfile from "./controllers/searchUser.controller.js"
import { updateProfile, updateProfilePicture } from "./controllers/updateProfile.controller.js"
import unfollowUser from "./controllers/followersdecrese.js"
import followUser from "./controllers/followersincrese.js"
import { createPost, getAllPosts, getUserPosts, likePost, commentOnPost } from "./controllers/post.controller.js"
import messageRoutes from "./routes/message.routes.js"
import conversationRoutes from "./routes/conversation.routes.js"
import { app, server } from "./socket/socket.js"
import fileUpload from "express-fileupload"
import Post from "./models/post.model.js"

// load the .env file 
dotenv.config({ path: './.env' })

// express to handle the route and listening

// const app = express()

// to allow cross-origin access



app.use(cors({
    origin: "http://localhost:5173",  // Allow frontend origin
    credentials: true,                // Allow cookies & authentication headers
}));


// Middleware for file upload
app.use(fileUpload({ useTempFiles: true }));



// to process the json data(middle-ware)

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


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
    const { fullName, userName, email, password, profession, about } = req.body;
    if (!password) return res.status(400).send("Password is required");
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarLocalPath = req.file.path;
  
    try {
      const response = await cloudinary.uploader.upload(avatarLocalPath, { resource_type: "image" });
      fs.unlinkSync(avatarLocalPath);
      
      const newUser = new User({
        fullName,
        userName,
        email,
        password: hashedPassword,
        profession,
        about,
        avatar: response.secure_url,
      });
      await newUser.save();
  
      res.json({ message: "User registered successfully", avatar: response.secure_url });
    } catch (error) {
        console.error("Signup Error:", error);
      res.status(500).json({ error: error.message });
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

        await User.findByIdAndUpdate(userFound._id, { accessToken: token });

        res.status(200)
            .cookie("accessToken", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" })
            .json({
                message: "Login successful",
                token,
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

app.post("/api/upload/image", verifyJwt, upload.single("file"), async (req, res) => {
    const localFilePath = req.file.path;
    const { caption } = req.body;

    try {
        const user = req.user;
        if (!user) {
            return res.status(400).send("User not found");
        }

        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "image" });

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        const uploaded_file_link = response.secure_url;

        // ✅ Create Post in MongoDB
        const newPost = new Post({
            userId: user._id,
            username: user.userName,
            profilePic: user.profilePic,
            postImage: uploaded_file_link,
            fileType: "image",
            caption: caption,
        });

        await newPost.save();

        return res.json({ message: "Image uploaded and post created successfully", post: newPost });
    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.log(error);
        return res.status(500).send("Image upload failed");
    }
});


app.post("/api/upload/video", verifyJwt, video_upload.single("file"), async (req, res) => {
    const localFilePath = req.file.path;
    const { caption } = req.body;

    try {
        const user = req.user;
        if (!user) {
            return res.status(400).send("User not found");
        }

        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "video" });

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        const uploaded_file_link = response.secure_url;

        // ✅ Create Post in MongoDB
        const newPost = new Post({
            userId: user._id,
            username: user.userName,
            profilePic: user.profilePic,
            postImage: uploaded_file_link,
            fileType: "video",
            caption: file_description,
        });

        await newPost.save();

        return res.json({ message: "Video uploaded and post created successfully", post: newPost });
    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.log(error);
        return res.status(500).send("Video upload failed");
    }
});


app.post("/api/upload-and-create", verifyJwt, async (req, res) => {
    try {
        console.log("Incoming File:", req.files);
        console.log("Request Body:", req.body);

        // ✅ Fetch user details from authentication middleware
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User not authenticated" });
        }

        const { profilePic, caption } = req.body;
        const file = req.files?.file;

        if (!file) {
            return res.status(400).json({ message: "No file provided" });
        }

        console.log("Uploading to Cloudinary...");
        const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "uploads",
        });

        console.log("Upload Successful:", uploadedFile.secure_url);

        // 🟢 Create Post in MongoDB
        const newPost = new Post({
            userId: req.user.id,         // ✅ Get userId from req.user
            username: req.user.userName, // ✅ Get username from req.user
            profilePic: req.user.profilePic || profilePic, // ✅ Use profilePic from DB if available
            postImage: uploadedFile.secure_url,
            fileType: file.mimetype.startsWith("image") ? "image" : "video",
            caption,
        });

        await newPost.save();

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: newPost,
        });
    } catch (error) {
        console.error("Error Details:", error); // 🔍 Logs full error
    res.status(500).json({ message: "Something went wrong!", error: error.message });
    }
});


// Post APIs Endpoints

app.post("/api/create", verifyJwt, createPost); // Create Post

app.get("/api/all", getAllPosts); // Fetch All Posts

app.get("/api/user/:userId", getUserPosts); // Get User's Posts

app.put("/api/like/:postId", verifyJwt, likePost); // Like Post

app.post("/api/comment/:postId", verifyJwt, commentOnPost); // Comment on Post


// message function calling on a specific route

app.use("/api/messages", messageRoutes)


app.use("/api/conversations", conversationRoutes)

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

app.get("/api/users", async (req, res) => {
    try {
      const users = await User.find({}, "userName fullName email profession about avatar"); // ✅ Fetch only required fields
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting user" });
    }
  });
  app.post("/api/admin/logout", (req, res) => {
    res.clearCookie("token"); // Remove auth token (if using cookies)
    res.json({ message: "Logged out successfully" });
  });

// listener on specific port on which the server is running

app.listen(process.env.PORT, () => {
    console.log("Server started on port", process.env.PORT)
})