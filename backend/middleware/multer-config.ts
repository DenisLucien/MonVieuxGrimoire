import multer from 'multer';
import { Request } from 'express';
import { Express } from 'express-serve-static-core';

const MIME_TYPES:{[key:string]:string} = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req:Request, file:Express.Multer.File, callback:(error:Error|null,destination:string)=>void) => {
    callback(null, "images");
  },
  filename: (req:Request, file:Express.Multer.File, callback:(error:Error|null,filename:string)=>void) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

export default multer({ storage }).single("image");
