//All necessary imports
import * as express from "express"; //express object
import * as bodyParser from "body-parser"; //body parser middleware
import { User } from "./models/User"; //User model
import { Role } from "./models/Role"; //Role model
import { Reimbursement } from "./models/Reimbursement"; //Reimbursement Model
import { ReimbursementStatus } from "./models/ReimbursementStatus"; //Status Model
import { ReimbursementType } from "./models/ReimbursementType"; //Type Model
import { loggingMiddleware } from "./middleware/logging-middleware";
import { sessionMiddleware } from "./middleware/session-middleware";
import { userRouter } from "./routers/user-router";
import { findUserByUsernameAndPassword } from "./services/user-service";
import { reimbursementRouter } from "./routers/reimbursement-router";
import { corsFilter } from "./middleware/cors-filter";

//create express object
const ers = express();
//Middleware

//Body Parser processes the body of the request and passes it to the next endpoint
ers.use("/", bodyParser.json());

//Keeps track of what requests and methods
ers.use(loggingMiddleware);

//Logs user to their session
ers.use(sessionMiddleware);

//Add cors filter middleware
ers.use(corsFilter);

//Validate Login Information
//Login
//REMEMBER THE SECOND PARAMETER IS AN ARROW FUNCTION
ers.post("/login", async (req, res) => {
  //STEP 1 - GET DATA
  //looks in the body for these fields and then sets them to these variables
  const { username, password } = req.body;
  //STEP 2 - VALIDATE DATA
  if (!username || !password) {
    res.status(400).send("Please include username and password");
  } else {
    try {
      let user = await findUserByUsernameAndPassword(username, password);
      //dynamically adds user field to the session
      req.session.user = user;
      res.status(200).json(user); //send user object for us to use in the future
    } catch (error) {
      res.status(error.status).send(error.message);
    }
  }
});

//send user to the userRouter
ers.use("/users", userRouter);

//send user to the reimbursementRouter
ers.use("/reimbursements", reimbursementRouter);

//Listen for requests
ers.listen("2020", () => {
  console.log("App has started on port 2020");
});
