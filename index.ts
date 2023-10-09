import express from "express";
import cors from "cors";
import cookies from "cookie-parser";
import serverless from "serverless-http";
import { getData } from "./src/routes/mainRoute.ts";
import { Server } from "socket.io";
import http from "http";
const app = express();
app.use(cookies());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(getData);
app.listen(8000, () => {
  console.log("Listening on 8000");
});

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (_socket) => {
  console.log("a user connected");
});

export const handler = serverless(app);
