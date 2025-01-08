import User from "../models/user.models.js"

// ye function user ke cookies mai store accessToken ko clear kr dega jis ke karan vo fir kuch bhi access nhi kr payega and
// and logout ho jyega 

const logOutUser=async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                accessToken:1
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200).clearCookie("accessToken",options).json({message:"logout sucessfull"})
}

export default logOutUser