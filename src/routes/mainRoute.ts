import express, { Request, Response } from "express";

import { user } from "../models/userModel.ts";
import { loginUser, registerUser } from "../services/credUser.ts";

const getData = express.Router();
getData.use(express.json());

getData.post("/signup", async (_req: Request, res: Response) => {
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
          .json({
            error: "UserConflict",
            message: "User already exists in the database.",
          });
      }
    } else {
      res.status(500).json({ message: result });
    }
  } else {
    res.status(400).json({ message: "Username and Password required" });
  }
});

getData.get("/login", async (_req: Request, res: Response) => {
  if (_req.body.userDetails.username && _req.body.userDetails.password) {
    const userInfo: user = {
      username: _req.body.userDetails.username,
      password: _req.body.userDetails.password,
    };
    const result: boolean | string = await loginUser(userInfo);

    if (typeof result === "boolean") {
      if (result === true) {
        res.status(200).json({ message: "Login Successful!" });
      } else {
        res.status(409).json({ error: "User Doesn't Exist! Please Register" });
      }
    } else {
      res.status(500).json({ message: result });
    }
  } else {
    res.status(400).json({ message: "Username and Password required" });
  }
});
export { getData };
