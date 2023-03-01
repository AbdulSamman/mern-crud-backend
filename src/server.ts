import express from "express";
import * as model from "./model";
import dotenv from "dotenv";
import logger from "./logger";
dotenv.config();
import cors from "cors";
import { IBook } from "./interfaces";
const port = process.env.PORT || 3828;

const app = express();
app.use(express.json());
app.use(logger);
app.use(cors());

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(model.getApiInstructions());
});

app.get("/books", async (req: express.Request, res: express.Response) => {
  try {
    res.status(200).json(await model.getBooks());
  } catch (error) {
    res.status(401).send(error.message);
  }
});

app.get("/book/:id", async (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  try {
    const result = await model.getBook(id);
    res.status(200).json({ message: `fetched book with id ${id}`, result });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

app.patch("/book/:id", async (req: express.Request, res: express.Response) => {
  const id = req.params.id;
  const book: IBook = req.body;
  try {
    const result = await model.editBook(id, book);
    res.status(200).json({
      oldBook: result.oldOne,
      result: result.newOne,
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
