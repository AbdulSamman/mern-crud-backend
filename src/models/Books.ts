import mongoose from "mongoose";

const BooksSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    numberOfPages: Number,
    language: String,
    imageUrl: String,
    buyUrl: String,
  },
  { versionKey: false }
);

export const Books = mongoose.model("book", BooksSchema);
