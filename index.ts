import express from "express";
import cors from "cors";
import cookies from "cookie-parser";
import serverless from "serverless-http";
import { getData } from "./src/routes/mainRoute.ts";

const app = express();
app.use(cookies());
app.use(getData);
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.listen(8000, () => {
  console.log("Listening on 8000");
});

export const handler = serverless(app);
