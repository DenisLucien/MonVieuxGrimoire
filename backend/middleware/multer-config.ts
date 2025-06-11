import multer from 'multer';
import { Request } from 'express';
import { Express } from 'express-serve-static-core';
import sharp from 'sharp';
import fs from "fs";

const MIME_TYPES: { [key: string]: string } = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
    callback(null, "images");
  },
  filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

const upload = multer({ storage }).single("image");

export const optimizeImage = async (req: Request, res: any, next: any) => {
  if (!req.file) return next();

  const inputPath = req.file.path;
  const ext = inputPath.split('.').pop()?.toLowerCase();
  const tempPath = inputPath + ".tmp";

  try {
    if (ext === "png") {
      await sharp(inputPath)
        .resize({ width: 800 })
        .png({ quality: 70, compressionLevel: 8 })
        .toFile(tempPath);
    } else {
      await sharp(inputPath)
        .resize({ width: 800 })
        .jpeg({ quality: 70 })
        .toFile(tempPath);
    }
    fs.renameSync(tempPath, inputPath);
    next();

  } catch (err) {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    next(err);
  }
};

export default upload;