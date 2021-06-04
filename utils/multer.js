const multer = require("multer"); 
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const path =require("path")


module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        //extension name
        let ext = path.extname(file.originalname); 
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png"){
            cb(new Error("File type is not supported"), false); 
            return
        }
        cb(null, true); 
    }
})