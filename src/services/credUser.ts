import { createClient } from "redis";
import { user } from "../models/userModel";
import { configDotenv } from "dotenv";
configDotenv();

const uri: string = process.env["DB_URL"]!;
const password: string = process.env["PASSWORD"]!;
const port: string = process.env["PORT"]!;
console.log(port, parseInt(port));
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
    console.log(err);
    console.log("Client is already connected");
  }
  await client
    .get("allUsers")
    .then((result) => {
      if (result === null) {
        client.set("allUsers", JSON.stringify([{ ...userInfo, id: 1 }]));
        return true;
      } else {
        let userDataSet: user[] = JSON.parse(result);

        if (
          userDataSet.filter((e) => e.username !== userInfo.username).length
        ) {
          userDataSet = [
            ...userDataSet,
            { ...userInfo, id: userDataSet.length + 1 },
          ];

          client.set("allUsers", JSON.stringify(userDataSet));
          return true;
        }
        return false;
      }
    })
    .catch((error) => {
      console.log(error);
      return "Network Error!";
    });
  return "Something Went Wrong!";
};

export const loginUser = async (userInfo: user): Promise<string | boolean> => {
  try {
    await client.connect();
  } catch (err) {
    console.log("Client is already connected");
  }
  await client
    .get("allUsers")
    .then((result) => {
      console.log(result);
      if (result === null) {
        return false;
      } else {
        let userDataSet: user[] = JSON.parse(result);
        console.log(userDataSet);
        if (
          userDataSet.filter((e) => e.username === userInfo.username).length
        ) {
          return true;
        }
        return false;
      }
    })
    .catch((error) => {
      console.log(error);
      return "Network Error!";
    });
  return "Something Went Wrong!";
};
