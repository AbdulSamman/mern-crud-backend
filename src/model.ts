import { Books } from "./models/Books.js";
import mongoose from "mongoose";
import { IBook } from "./interfaces.js";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_CONNECTION =
  process.env.MONGODB_CONNECTION || "mongodb://localhost:27017";

mongoose.set("strictQuery", false);
mongoose.connect(MONGODB_CONNECTION);

export const getBooks = async () => {
  const books: IBook[] = await Books.find();
  return books;
};

export const getApiInstructions = () => {
  return `
  
      <style>
      body {
          background-color: #444;
          padding: 1rem;
          color: #fff;
          font-family: courier;
      }
      a {
          color: yellow;
      }
  </style>
  <h1>BOOK Site API</h1>
  <ul>
      <li><a href="/books">/books</a> - get all books</li>
  </ul>
  
  `;
};
