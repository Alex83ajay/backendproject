const multer=require('multer')
const path = require('path');     
const fs = require('fs');  
      

// const filePath = {
//     fs.exis
// }
             
const storage = multer.diskStorage({      //disk strorage. one of the method server la store pana image or file /server disk la
    destination: function (req, file, cb){   //req varathu handle panraathuku destination
     console.log("file", file);        
     cb(null, "./src/uploads/") //error இல்லை, இந்த new name-ஆ save பண்ணு.  succes akiruchi   and src  path la uploaad   panu  muleter ah solrom 
 },                    
    filename: function (req, file, cb){  //entha name la store akanumnu file name unique store pananum nerya peru upload panuvanga resume
        // const extension = path.extname(file.originalname);//file-ன் extension (ex: .jpg, .png) எடுக்கும்.
        const fileName = `${Date.now()}-${file.originalname}`;  //unique file name store panre upload panratha
        cb(null, fileName)    
    }     
});      

const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']

const fileFilter = (req, file, cb) =>{
    if(allowedTypes.includes(file.mimetype)){
        cb(null, true)
    }else{
        cb(new Error("Upload proper file format"), false)
    }
}
       
const upload = multer({
    storage:storage,
    fileFilter:fileFilter

});

module.exports = upload;  