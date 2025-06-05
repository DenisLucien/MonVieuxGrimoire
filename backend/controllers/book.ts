import Book, { BookDocument } from "../models/Book";
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import { AuthReq } from "../middleware/auth";
import { get } from "http";
import { z } from 'zod';
type Rating = {
  userId: string;
  grade: number;
};



export const getBooks = (req: Request, res: Response, next: NextFunction):void => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

export const getBook = (req: Request, res: Response, next: NextFunction) => {
  
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => res.status(400).json({ error }));
};

export const getBooksBestrating = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let books: BookDocument[] = await Book.find();
    if (!books || books.length === 0) {
      res.status(404).json({ message: "Aucun livre trouvé." });
    }
    const retour = books
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 3);

    res.status(200).json(retour);
  } catch (error) {
    console.error("Erreur lors de la récupération des livres:", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
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

    await newBook
      .save()
      .then(() => res.status(201).json({ message: "Livre créé avec succès !" }))
      .catch((error) => res.status(400).json({ error }));
  } catch (error) {
    console.error("Erreur lors de la création du livre:", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

export const modifyBook = (req: AuthReq, res: Response, next: NextFunction) => {
  const modifBook = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  delete modifBook.userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      } else {
        if (req.auth === undefined) {
          res.status(401).json({ message: "Not authorized" });
        } else {
          Book.updateOne(
            { _id: req.params.id },
            { ...modifBook, _id: req.params.identifiant }
          )
            .then(() => {
              res.status(200).json({ message: "Livre modifié avec succès!" });
            })
            .catch((error) => {
              res.status(400).json({ error });
            });
        }
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

export const deleteBook = (req: AuthReq, res: Response, next: NextFunction) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      } else {
        if (req.auth === undefined) {
          res.status(401).json({ message: "Not authorized" });
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
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const postBookRating = async (
  req: AuthReq,
  res: Response,
  next: NextFunction
) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      } else {
        if (req.auth === undefined) {
          res.status(401).json({ message: "Not authorized" });
        }
        const alreadyRated = book.ratings.find(
          (rating: Rating) => rating.userId === req.auth!.userId
        );
        if (alreadyRated) {
          return res
            .status(401)
            .json({ message: "Vous avez déjà noté ce livre." });
        }
        const newRating: Rating = {
          userId: req.auth!.userId,
          grade: req.body.rating,
        };
        book.ratings.push(newRating);
        
        book.calculateAverageRating();
        book.save().then((savedBook) => {
          res.status(200).json(savedBook);
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
