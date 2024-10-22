const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req:Request, file:any, cb:any) => {
        cb(null, 'uploads/'); 
    },
    filename: (req:Request, file:any, cb:any) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
  });
export const upload = multer({ storage });