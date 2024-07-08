import express, { Express, Request, Response } from "express";

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the API!");
});

app.listen(3000, () => console.log("App working!"));
