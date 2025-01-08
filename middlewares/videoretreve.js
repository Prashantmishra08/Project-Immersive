
import { Photo } from "../models/photo.model.js"
import  User  from "../models/user.models.js"
import { Video } from "../models/video.model.js"

const video_retreve = async (req, res) => {
    try {
        const files = await Video.find()
        
       
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
}
export default video_retreve
