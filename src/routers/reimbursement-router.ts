import * as express from "express";
import { Reimbursement } from "../models/Reimbursement";
import {
  authAdminMiddleware,
  authUserMiddleware,
  authFactory,
  authCheckId
} from "../middleware/auth-middleware";
import { ReimbursementDTO } from "../dtos/ReimbursementDTO";
import {
  findReimbursementByStatusId,
  findReimbursementByUserId,
  saveOneReimbursement,
  updateReimbursement
} from "../services/reimbursement-service";

export const reimbursementRouter = express.Router();

//find reimbursement by status
reimbursementRouter.get(
  "/status/:statusId",
  authFactory(["Admin", "Finance-Manager"]),
  authCheckId,
  async (req, res) => {
    const id = +req.params.statusId; // the plus sign is to type coerce into a number
    if (isNaN(id)) {
      res.sendStatus(400);
    } else {
      try {
        let reimbursement: Reimbursement[] = await findReimbursementByStatusId(
          id
        );
        //let reimbursement = await findReimbursementByStatusId(id);
        res.json(reimbursement);
      } catch (e) {
        res.status(e.status).send(e.message);
      }
    }
  }
);

//find reimbursement by user
reimbursementRouter.get(
  "/author/userId/:userId",
  authFactory(["Admin", "Finance-Manager", "User"]),
  authCheckId,
  async (req, res) => {
    const id = +req.params.userId; // the plus sign is to type coerce into a number
    if (isNaN(id)) {
      res.sendStatus(400);
    } else {
      try {
        let reimbursement: Reimbursement[] = await findReimbursementByStatusId(
          id
        );
        //let reimbursement = await findReimbursementByUserId(id);
        res.json(reimbursement);
      } catch (e) {
        res.status(e.status).send(e.message);
      }
    }
  }
);

//submit reimbursement
reimbursementRouter.post(
  "",
  authFactory(["Admin", "User", "Finance-Manager"]),
  async (req, res) => {
    let {
      //reimbursementId,
      author,
      amount,
      dateSubmitted,
      dateResolved,
      description,
      resolver,
      status,
      type
    }: {
      //reimbursementId: number;
      author: number;
      amount: number;
      dateSubmitted: number;
      dateResolved: number;
      description: string;
      resolver: number;
      status: number;
      type: number;
    } = req.body; // this will be where the data the sent me is
    // the downside is this is by default just a string of json, not a js object
    if (
      //reimbursementId &&
      author &&
      amount &&
      dateSubmitted &&
      dateResolved &&
      description &&
      resolver &&
      status &&
      type
    ) {
      let newReimbursement = await saveOneReimbursement(
        new ReimbursementDTO(
          0,
          author,
          amount,
          dateSubmitted,
          dateResolved,
          description,
          resolver,
          status,
          type
        )
      );
      // this would be some function for adding a new user to a db
      res.status(201).json(newReimbursement);
    } else {
      res.status(400).send("Please include all reimbursement fields");
      // for setting a status and a body
    }
  }
);

//update reimbursement
reimbursementRouter.patch("", [
  authFactory(["Admin", "Finance-Manager"]),
  async (req, res) => {
    //console.log("i reached the endpoint");

    let {
      reimbursementId,
      author,
      amount,
      dateSubmitted,
      dateResolved,
      description,
      resolver,
      status,
      type
    }: {
      reimbursementId: number;
      author: number;
      amount: number;
      dateSubmitted: number;
      dateResolved: number;
      description: string;
      resolver: number;
      status: number;
      type: number;
    } = req.body;
    if (
      reimbursementId &&
      (author ||
        amount ||
        dateSubmitted ||
        dateResolved ||
        description ||
        resolver ||
        status ||
        type)
    ) {
      //call service function using req.body
      //console.log(req.body);

      let update = await updateReimbursement(req.body);
      res.json(update);
    }
  }
]);
