import express, { Request, Response } from "express";
import { createClient } from "redis";
import { configDotenv } from "dotenv";

configDotenv();

const getData = express.Router();
const uri: string = process.env["DB_URL"]!;
const password: string = process.env["PASSWORD"]!;
const port: string = process.env["PORT"]!;

const client = createClient({
  password: password,
  socket: {
    host: uri,
    port: parseInt(port),
  },
});

getData.get("/api", async (_req: Request, res: Response) => {
  await client.connect();
  client.set("okay", 6);
  res.status(200).json({ message: "you got it!" });
});

export { getData };
