import express, { Request, Response } from "express";
import { createClient } from "redis";
import { configDotenv } from "dotenv";
import { Server } from "socket.io";
import http from "http";

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
    console.log();
    await client.connect();
  } catch (err) {
    console.log(err);
  }
  client.set("okay", 6);
  res.status(200).json({ message: "you got it!" });
});

export { getData };
