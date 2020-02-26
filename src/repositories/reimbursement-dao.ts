import { PoolClient } from "pg";
import { connectionPool } from ".";
import { Reimbursement } from "../models/Reimbursement";
//import { BadCredentialsError } from "../errors/BadCredentialsError";
import { InternalServerError } from "../errors/InternalServerError";
//import { userDTOToUserConverter } from "../util/user-dto-to-user-converter";
import { ReimbursementDTO } from "../dtos/ReimbursementDTO";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";
import { reimbursementDTOToReimbursementConverter } from "../util/reimbursement-dto-to-reimbursement-converter";

export async function daofindReimbursementByStatusId(
  id: number
): Promise<Reimbursement[]> {
  let client: PoolClient;
  try {
    client = await connectionPool.connect();
    //FIX TO ADD ORDER BY TO QUERY
    let results = await client.query(
      'SELECT * FROM project0."Reimbursement" R inner join project0."ReimbursementStatus" RS on R.status = RS.status_id WHERE RS.status_id = $1 ORDER BY R.date_submitted',
      [id]
    );
    if (results.rowCount === 0) {
      throw new Error("Reimbursement Not Found");
    }
    //FIX TO PRINT OUT MULTIPLE ROWS
    return results.rows.map(reimbursementDTOToReimbursementConverter);
    //console.log(results.rows);

    //return results.rows[0];
  } catch (e) {
    // id DNE
    //need if for that
    if (e.message === "Reimbursement Not Found") {
      throw new ReimbursementNotFoundError();
    }
    throw new InternalServerError();
  } finally {
    client && client.release();
  }
}

export async function daofindReimbursementByUserId(
  id: number
): Promise<Reimbursement[]> {
  let client: PoolClient;
  try {
    client = await connectionPool.connect();
    //FIX TO ADD ORDER BY TO QUERY
    let results = await client.query(
      'SELECT * FROM project0."Reimbursement" R WHERE R.author = $1 order by R.date_submitted',
      [id]
    );
    if (results.rowCount === 0) {
      throw new Error("Reimbursement Not Found");
    }
    //FIX TO PRINT OUT MULTIPLE ROWS
    return results.rows.map(reimbursementDTOToReimbursementConverter);
    //console.log(results.rows);

    //return results.rows[0];
  } catch (e) {
    // id DNE
    //need if for that
    if (e.message === "Reimbursement Not Found") {
      throw new ReimbursementNotFoundError();
    }
    throw new InternalServerError();
  } finally {
    client && client.release();
  }
}

export async function daoSaveOneReimbursement(
  newReimbursement: ReimbursementDTO
): Promise<Reimbursement> {
  let client: PoolClient;
  try {
    client = await connectionPool.connect();
    /*      FINISH IMPLEMENTATION */
    // send a query and immeadiately get the role id matching the name on the dto
    //let roleId = (await client.query(
    //  "SELECT * FROM public.roles WHERE role_name = $1",
    //  [newReimbursement.role_name]
    //)).rows[0].role_id;
    // send an insert that uses the id above and the user input

    let result = await client.query(
      'INSERT INTO project0."Reimbursement" (author,amount,date_submitted,date_resolved,description,resolver,status,"type") values ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING reimbursement_id;',
      [
        newReimbursement.author,
        newReimbursement.amount,
        newReimbursement.date_submitted,
        newReimbursement.date_resolved,
        newReimbursement.description,
        newReimbursement.resolver,
        newReimbursement.status,
        newReimbursement.type
      ]
    );

    // put that newly genertaed reimbursement_id on the DTO
    newReimbursement.reimbursement_id = result.rows[0].reimbursement_id;

    return reimbursementDTOToReimbursementConverter(newReimbursement); // convert and send back
  } catch (e) {
    console.log(e);

    throw new InternalServerError();
  } finally {
    client && client.release();
  }
}

// function that updates a reimbursement and returns the updated reimbursement
export async function daoUpdateReimbursement(
  newReimbursement: Reimbursement
): Promise<Reimbursement> {
  let client: PoolClient;
  try {
    client = await connectionPool.connect();
    //console.log("in dao");

    let reimbursementId = newReimbursement.reimbursementId;
    //the non updated reimbursement row
    //let oldReimbursement = await findUserById(userId);
    let oldReimbursement = (await client.query(
      'SELECT * FROM project0."Reimbursement" R WHERE R.reimbursement_id = $1',
      [reimbursementId]
    )).rows[0];

    //console.log(oldReimbursement);
    //use default to set new variables (new vars to old vars if they exist)
    oldReimbursement.author =
      newReimbursement.author || oldReimbursement.author;
    oldReimbursement.amount =
      newReimbursement.amount || oldReimbursement.amount;
    oldReimbursement.date_submitted =
      newReimbursement.dateSubmitted || oldReimbursement.date_submitted;
    oldReimbursement.date_resolved =
      newReimbursement.dateResolved || oldReimbursement.date_resolved;
    oldReimbursement.description =
      newReimbursement.description || oldReimbursement.description;
    oldReimbursement.resolver =
      newReimbursement.resolver || oldReimbursement.resolver;
    oldReimbursement.status =
      newReimbursement.status || oldReimbursement.status;
    oldReimbursement.type = newReimbursement.type || oldReimbursement.type;

    await client.query(
      'UPDATE project0."Reimbursement" set author = $1, amount = $2, date_submitted = $3, date_resolved = $4, description = $5, resolver = $6, status = $7, type = $8 WHERE reimbursement_id = $9',
      [
        oldReimbursement.author,
        oldReimbursement.amount,
        oldReimbursement.date_submitted,
        oldReimbursement.date_resolved,
        oldReimbursement.description,
        oldReimbursement.resolver,
        oldReimbursement.status,
        oldReimbursement.type,
        reimbursementId
      ]
    );
    //console.log(oldUser);

    //console.log(oldUser);

    //console.log(result);

    // put that newly genertaed user_id on the DTO
    //newUser.user_id = result.rows[0].user_id;
    return oldReimbursement; // convert and send back
  } catch (e) {
    //console.log(e);

    throw new InternalServerError();
  } finally {
    client && client.release();
  }
}
