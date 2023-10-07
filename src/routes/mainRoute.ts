import express, { Request, Response } from "express";
import { createClient } from "redis";
import { configDotenv } from "dotenv";
import { Server } from "socket.io";
import http from "http";
import { user } from "../models/userModel";

const app = express();

configDotenv();

const getData = express.Router();
getData.use(express.json());
const uri: string = process.env["DB_URL"]!;
const password: string = process.env["PASSWORD"]!;
const port: string = process.env["PORT"]!;

const server = http.createServer(app);
const io = new Server(server);

const client = createClient({
  password: password,
  socket: {
    host: uri,
    port: parseInt(port),
  },
});

io.on("connection", (_socket) => {
  console.log("a user connected");
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
    await client.get("usersOnline").then((result) => {
      if (result === null) {
        client.set("usersOnline", JSON.stringify([{ ...userInfo, id: 1 }]));
        res.status(200).json({ message: "User Created!" });
      } else {
        let userDataSet: user[] = JSON.parse(result);

        if (
          userDataSet.filter((e) => e.username !== userInfo.username).length
        ) {
          userDataSet = [
            ...userDataSet,
            { ...userInfo, id: userDataSet.length + 1 },
          ];

          client.set("usersOnline", JSON.stringify(userDataSet));
          res.status(200).json({ message: "User Created!" });
        } else {
          res
            .status(409)
            .json({ error: "Username Already Exists! Please login" });
        }
      }
    });
  } else {
    res.status(400).json({ message: "Username and Password required" });
  }
});

export { getData };
