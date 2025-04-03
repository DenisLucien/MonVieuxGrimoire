import express from "express";
import { getBooks, createBook,getBook,deleteBook } from "../controllers/book";
import multer from '../middleware/multer-config'
import auth from "../middleware/auth";
const router = express.Router();
router.get("/", getBooks);
router.get("/:id", getBooks);
router.post("/",multer, createBook);
router.delete("/:id",auth,deleteBook);
export default router;
