import { Books } from "./models/Books.js";
import mongoose from "mongoose";
import { IBook } from "./interfaces.js";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_CONNECTION =
  process.env.MONGODB_CONNECTION || "mongodb://localhost:bookapi";

mongoose.set("strictQuery", false);
mongoose.connect(MONGODB_CONNECTION);

export const getBooks = async () => {
  const rowBooks = await Books.find();
  const books = [];
  rowBooks.forEach((rowBook) => {
    const book = {
      _id: rowBook._id,
      title: rowBook.title,
      description: rowBook.description,
      imageUrl: rowBook.imageUrl,
      buyUrl: rowBook.buyUrl,
      languageText:
        rowBook.language.charAt(0).toUpperCase() + rowBook.language.slice(1),
    };
    books.push(book);
  });
  return books;
};

export const getBook = (id: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const book: IBook = await Books.findOne({ _id: id });
      resolve({
        status: "success",
        message: book,
      });
    } catch (error) {
      reject({
        status: "error",
        message: error.message,
      });
    }
  });
};

export const editBook = async (id: string, oldBook: IBook) => {
  try {
    const oldOne = await Books.findOne({ _id: id });
    await Books.updateOne({ _id: id }, { $set: { ...oldBook } });
    const newOne = await Books.findOne({ _id: id });
    return { oldOne, newOne };
  } catch (error) {
    throw new Error(`${error.message}`);
  }
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
