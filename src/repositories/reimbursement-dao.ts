import { PoolClient } from "pg";
import { connectionPool } from ".";
import { Reimbursement } from "../models/Reimbursement";
import { InternalServerError } from "../errors/InternalServerError";
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

    return results.rows.map(reimbursementDTOToReimbursementConverter);
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

    return results.rows.map(reimbursementDTOToReimbursementConverter);
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

    let reimbursementId = newReimbursement.reimbursementId;
    //the non updated reimbursement row
    let oldReimbursement = (await client.query(
      'SELECT * FROM project0."Reimbursement" R WHERE R.reimbursement_id = $1',
      [reimbursementId]
    )).rows[0];

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

    //return oldReimbursement; // convert and send back
    return reimbursementDTOToReimbursementConverter(oldReimbursement);
  } catch (e) {
    throw new InternalServerError();
  } finally {
    client && client.release();
  }
}

// ADDED FOR PROJECT 1
export async function daoFindAllReimbursements(): Promise<Reimbursement[]> {
  let client: PoolClient;

  try {
    client = await connectionPool.connect();
    let results = await client.query(
      'select R.reimbursement_id , U1.username as author, R.amount, R.date_submitted, R.date_resolved, R.description, U2.username as resolver, RS.status, RT."type" from project0."Reimbursement" R inner join project0."ReimbursementStatus" RS on R.status = RS.status_id inner join project0."ReimbursementType" RT on R."type" = RT.type_id inner join project0."User" U1 on R.author = U1.user_id inner join project0."User" U2 on R.resolver = U2.user_id order by R.date_submitted;'
    );
    return results.rows.map(reimbursementDTOToReimbursementConverter);
  } catch (e) {
    throw new InternalServerError();
  } finally {
    client && client.release();
  }
}
