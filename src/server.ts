import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import * as model from "./model";
import dotenv from "dotenv";
import logger from "./logger";
dotenv.config();
import cors from "cors";
import { IBook } from "./interfaces";

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

const port = process.env.PORT || 3828;

const app = express();
app.use(logger);
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
  })
);
// PUBLIC ROUTES

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(model.getApiInstructions());
});

app.get("/books", async (req: express.Request, res: express.Response) => {
  try {
    res.status(200).json(await model.getBooks());
  } catch (error) {
    console.log(error);

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

app.post("/login", (req: express.Request, res: express.Response) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    req.session.user = "admin" as any;
    // 10 sec
    req.session.cookie.expires = new Date(Date.now() + 10000);
    req.session.save();
    res.status(200).send("ok");
  } else {
    res.status(401).send({});
  }
});

app.get("/get-current-user", (req: express.Request, res: express.Response) => {
  if (req.session.user) {
    res.send(req.session.user);
  } else {
    res.send("anonymousUser");
  }
});

app.get("/logout", (req: express.Request, res: express.Response) => {
  req.session.destroy((err) => {
    if (err) {
      res.send("ERROR");
    } else {
      res.send("logged out");
    }
  });
});

// PROTECTED ROUTES

const authorizeUser = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.session.user === ("admin" as any)) {
    next();
  } else {
    res.status(401).send({});
  }
};

app.post(
  "/book",
  authorizeUser,
  async (req: express.Request, res: express.Response) => {
    const book = req.body;
    try {
      res.status(200).json(await model.addBook(book));
    } catch (error) {
      res.status(401).send(error.message);
    }
  }
);

app.delete(
  "/book/:id",
  authorizeUser,
  async (req: express.Request, res: express.Response) => {
    const _id = req.params.id;
    try {
      res.status(200).json(await model.deleteBook(_id));
    } catch (error) {
      res.status(401).send(error.message);
    }
  }
);

app.patch(
  "/book/:id",
  authorizeUser,
  async (req: express.Request, res: express.Response) => {
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
  }
);

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
