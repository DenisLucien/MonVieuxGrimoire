import express from "express";
import { getBooks, createBook,getBook,deleteBook } from "../controllers/book";
import multer from '../middleware/multer-config'
import { auth, AuthReq} from "../middleware/auth";
const router = express.Router();
router.get("/", getBooks);
router.get("/:id", getBook);
router.post("/",multer, createBook);
router.delete("/:id",auth,deleteBook);
export default router;
