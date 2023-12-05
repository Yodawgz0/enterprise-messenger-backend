import { createClient } from "redis";
import { user } from "../models/userModel";
import { configDotenv } from "dotenv";
configDotenv();

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

export const registerUser = async (
  userInfo: user
): Promise<string | boolean> => {
  try {
    await client.connect();
  } catch (err) {
    await client.disconnect();
    await client.connect();
  }
  let returnVal: string | boolean = "";
  await client
    .get("allUsers")
    .then((result) => {
      if (result === null) {
        client.set("allUsers", JSON.stringify([{ ...userInfo, id: 1 }]));
        returnVal = true;
      } else {
        let userDataSet: user[] = JSON.parse(result);
        if (
          !userDataSet.filter((e) => e.username === userInfo.username).length
        ) {
          userDataSet = [
            ...userDataSet,
            { ...userInfo, id: userDataSet.length + 1 },
          ];

          client.set("allUsers", JSON.stringify(userDataSet));
          returnVal = true;
        } else {
          returnVal = false;
        }
      }
      return returnVal;
    })
    .catch((error) => {
      console.log(error);
      returnVal = "Network Error!";
    });
  return returnVal;
};

export const loginUser = async (userInfo: user): Promise<string | boolean> => {
  try {
    await client.connect();
  } catch (err) {
    console.log("Client is already connected");
  }
  let returnVal: string | boolean = "";
  await client
    .get("allUsers")
    .then((result) => {
      if (result === null) {
        returnVal = false;
      } else {
        let userDataSet: user[] = JSON.parse(result);
        if (
          userDataSet.filter((e) => e.username === userInfo.username).length
        ) {
          returnVal = true;
        } else {
          returnVal = false;
        }
      }
      return returnVal;
    })
    .catch((error) => {
      console.log(error);
      returnVal = "Network Error!";
    });
  return returnVal.length || typeof returnVal === "boolean"
    ? returnVal
    : "Something Went Wrong!";
};
