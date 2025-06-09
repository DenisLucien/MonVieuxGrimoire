import express from "express";
import {
  getBooks,
  createBook,
  getBook,
  deleteBook,
  modifyBook,
  getBooksBestrating,
  postBookRating,
} from "../controllers/book";
import upload, { optimizeImage } from "../middleware/multer-config";
import { auth, AuthReq } from "../middleware/auth";
const router = express.Router();
router.get("/", getBooks);
router.get("/bestrating", getBooksBestrating);
router.get("/:id", getBook);
router.post("/", upload, optimizeImage, auth, createBook);
router.post("/:id/rating", auth, postBookRating);
router.put("/:id", upload, optimizeImage, auth, modifyBook);
router.delete("/:id", auth, deleteBook);
export default router;
