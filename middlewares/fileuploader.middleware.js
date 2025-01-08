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
    if(file.mimetype.startsWith('image/')){
        cb(null,true)
    }
    else{
        cb(new Error('only image is allowed'),false)
    }
}

  
const upload = multer({ storage: storage , fileFilter})

export default upload