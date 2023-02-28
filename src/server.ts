import express from "express";
import * as model from "./model";
import dotenv from "dotenv";
import logger from "./logger";
dotenv.config();

const port = process.env.PORT || 3828;

const app = express();
app.use(express.json());
app.use(logger);

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(model.getApiInstructions());
});

app.get("/books", async (req: express.Request, res: express.Response) => {
  try {
    const result = await model.getBooks();
    res.status(200).json(result);
  } catch (error) {
    res.status(401).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
