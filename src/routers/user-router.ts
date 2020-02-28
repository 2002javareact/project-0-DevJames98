import * as express from "express";
import { User } from "../models/User";
import { authFactory, authCheckId } from "../middleware/auth-middleware";
import {
  findAllUsers,
  updateUser,
  findUserById
} from "../services/user-service";
import { Role } from "../models/Role";

export const userRouter = express.Router();

//find users
userRouter.get("", [
  authFactory(["Admin", "Finance-Manager"]),
  async (req, res) => {
    //get all of our users
    //format them to json
    //use the response obj to send them back
    let users: User[] = await findAllUsers();
    res.json(users); // this will format the object into json and send it back
  }
]);

//find users by id
userRouter.get(
  "/:id",
  authFactory(["Admin", "Finance-Manager", "User"]),
  authCheckId,
  async (req, res) => {
    const id = +req.params.id; // the plus sign is to type coerce into a number
    if (isNaN(id)) {
      res.sendStatus(400);
    } else {
      try {
        let user = await findUserById(id);
        res.json(user);
      } catch (e) {
        res.status(e.status).send(e.message);
      }
    }
  }
);

//update user
userRouter.patch("", [
  authFactory(["Admin"]),
  async (req, res) => {
    let {
      userId,
      username,
      firstName,
      lastName,
      email,
      role
    }: {
      userId: number;
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      role: Role;
    } = req.body;
    if (userId && (username || firstName || lastName || email || role)) {
      //call service function using req.body
      //try catch for await function
      let update = await updateUser(req.body);
      res.json(update);
    }
  }
]);
//fix error handling
