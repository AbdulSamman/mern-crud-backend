import { Books } from "./models/Books.js";
import mongoose from "mongoose";
import { IBook } from "./interfaces.js";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_CONNECTION =
  process.env.MONGODB_CONNECTION || "mongodb://localhost:bookapi";

mongoose.set("strictQuery", false);
mongoose.connect(MONGODB_CONNECTION);

const decorateAndSanitizeBook = (rawBook: any) => {
  const book: IBook = {
    ...rawBook.toObject({ versionKey: false }),
    languageText:
      rawBook.language.charAt(0).toUpperCase() + rawBook.language.slice(1),
  };
  return book;
};

export const getBooks = async () => {
  try {
    const rawBooks = await Books.find();
    const books: IBook[] = [];
    rawBooks.forEach((rawBook) => {
      books.push(decorateAndSanitizeBook(rawBook));
    });
    return books;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
};

export const getBook = async (id: string) => {
  try {
    const rawBook = await Books.findOne({ _id: id });
    const book = decorateAndSanitizeBook(rawBook);
    return book;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
};

export const addBook = async (book: IBook) => {
  try {
    const newBook = await Books.create(book);
    return { newId: newBook._id, newBook };
  } catch (error) {
    throw new Error(`${error.message}`);
  }
};

export const editBook = async (id: string, oldBook: IBook) => {
  try {
    const oldOne = await Books.find({ _id: id });
    await Books.updateOne({ _id: id }, { $set: { ...oldBook } });
    const newOne = await Books.find({ _id: id });
    return { oldOne, newOne };
  } catch (error) {
    throw new Error(`${error.message}`);
  }
};

export const deleteBook = async (_id: string) => {
  try {
    const deletedBook = await Books.deleteOne({ _id });

    return `${deletedBook} with ${_id} has been deleted`;
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
