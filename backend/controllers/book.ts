import Book from "../models/Book";
import { Request, Response, NextFunction } from "express";

export const getBooks = (req: Request, res: Response, next: NextFunction) => {
  console.log("trying to get books");
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

export const getBook = (req: Request, res: Response, next: NextFunction) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json({ error }));
};

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Aucune image téléchargée" });
      return;
    }
    const bookReq =
      typeof req.body.book === "string"
        ? JSON.parse(req.body.book)
        : req.body.book;
    const newBook = new Book({
      userId: bookReq.userId,
      title: bookReq.title,
      author: bookReq.author,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
      year: bookReq.year,
      genre: bookReq.genre,
      ratings: bookReq.ratings,
    });
    newBook.calculateAverageRating();
    console.log(req.body);
    console.log(bookReq);

    console.log(newBook);

    await newBook
      .save()
      .then(() => res.status(201).json({ message: "Livre créé avec succès !" }))
      .catch((error) => res.status(400).json({ error }));
  } catch (error) {
    console.error("Erreur lors de la création du livre:", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

export const deleteBook = (req: Request, res: Response, next: NextFunction) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      } else {
        if (book.userId != req.auth.userId) {
          res.status(401).json({ message: "Not authorized" });
        } else {
          const filename = book.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            book
              .deleteOne({ _id: req.params.id })
              .then(() => {
                res.status(200).json({ message: "Objet supprimé !" });
              })
              .catch((error) => res.status(401).json({ error }));
          });
        }
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
