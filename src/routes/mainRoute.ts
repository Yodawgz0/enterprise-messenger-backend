import express, { Request, Response } from "express";
import { createClient } from "redis";
import { configDotenv } from "dotenv";

import { user } from "../models/userModel";
import { registerUser } from "../services/credUser";

configDotenv();

const getData = express.Router();
getData.use(express.json());
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

getData.post("/signup", async (_req: Request, res: Response) => {
  try {
    await client.connect();
  } catch (err) {
    console.log("Client is already connected");
  }
  if (_req.body.userDetails.username && _req.body.userDetails.password) {
    const userInfo: user = {
      username: _req.body.userDetails.username,
      password: _req.body.userDetails.password,
    };
    const result: boolean | string = await registerUser(userInfo);

    if (typeof result === "boolean") {
      if (result === true) {
        res.status(200).json({ message: "User Created!" });
      } else {
        res
          .status(409)
          .json({ error: "Username Already Exists! Please login" });
      }
    } else {
      res.status(500).json({ message: result });
    }
  } else {
    res.status(400).json({ message: "Username and Password required" });
  }
});

export { getData };
