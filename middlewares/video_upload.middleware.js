import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
  })

const fileFilter=(req,file,cb) => {
    if(file.mimetype.startsWith('video/')){
        cb(null,true)
    }
    else{
        cb(new Error('only video is allowed'),false)
    }
}

  
const video_upload = multer({ storage: storage , fileFilter})

export default video_upload