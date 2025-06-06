import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "email-validator";
import { z } from "zod";
var passwordValidator = require("password-validator");

// Create a schema
var schemaPassword = new passwordValidator();

// Add properties to it
schemaPassword
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(2) // Must have at least 2 digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); // Blacklist these values

// const isValidEmail = (email: string): boolean => {
//   const emailRegex =
//     /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
//   return emailRegex.test(email);
// };
const emailSchema = z.string().email("L'adresse e-mail doit être valide");

export const ValidLogs = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (
      !emailSchema.safeParse(req.body.email).success ||
      !schemaPassword.validate(req.body.password)
    ) {
      res.status(400).json({ message: "email/password non valide" });
      return;
    }
    next();
  } catch (error) {
    res.status(401).json({ error: error || "Erreur !" });
  }
};
export default ValidLogs;
