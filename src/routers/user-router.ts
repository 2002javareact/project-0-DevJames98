import * as express from "express";
import { User } from "../models/User";
import {
  authAdminMiddleware,
  authUserMiddleware,
  authFactory,
  authCheckId
} from "../middleware/auth-middleware";
import {
  findAllUsers,
  updateUser,
  findUserById
} from "../services/user-service";
import { UserDTO } from "../dtos/UserDTO";
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
      //console.log(req.body);

      let update = await updateUser(req.body);
      res.json(update);
    }
  }
]);

/*
//generally a get request to the root of a path
//will give you every single one of those resources


// generally in rest convention
// a post request to the root of a resource will make one new of that resource
userRouter.post("", authFactory(["Admin"]), async (req, res) => {
  let {
    username,
    password,
    emailAddress,
    id,
    firstName,
    lastName,
    role
  }: {
    username: string;
    password: string;
    emailAddress: string;
    id: number;
    firstName: string;
    lastName: string;
    role: string;
  } = req.body; // this will be where the data the sent me is
  // the downside is this is by default just a string of json, not a js object
  if (
    username &&
    password &&
    emailAddress &&
    id &&
    firstName &&
    lastName &&
    role
  ) {
    let newUser = await saveOneUser(
      new UserDTO(
        0,
        username,
        password,
        firstName,
        lastName,
        emailAddress,
        role,
        //role_id
      )
    );
    // this would be some function for adding a new user to a db
    res.status(201).json(newUser);
  } else {
    res.status(400).send("Please include all user fields");
    // for setting a status and a body
  }
});


*/
