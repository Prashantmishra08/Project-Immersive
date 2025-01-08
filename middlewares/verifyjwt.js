import jwt from "jsonwebtoken"
import User from "../models/user.models.js"

// ye ake middle banaya hai, jo ke verify krega jwt token ko and agar shi hoga to request body mai user data add kr dega

export const verifyJwt = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken

        if (!token) {
            console.log("Access token is missing")
            return res.status(403).json({ message: "Access token is missing" })
        }

        // Log to check if the token is received correctly
        console.log("Token:", token);

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        // log to check the decoded token, just to verify that it contains the required fileds or not

        console.log("Decoded Token:", decodedToken)

        // here decodedToken? = unrapping the decodedToken to get the data

        const user = await User.findById(decodedToken?._id).select("-password -accessToken")

        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" })
        }
        
        // request ke body mai ake new object add kr do, user naam se jo ke const user wala data store krega

        req.user = user

        // pass the flag(next()) to the next function "mera kam ho gaya, ab tu execute ho jaa"

        next()


    } catch (error) {
        console.log("Error verifying token:", error)
        return res.status(401).json({ message: "Invalid token" })
    }
};
