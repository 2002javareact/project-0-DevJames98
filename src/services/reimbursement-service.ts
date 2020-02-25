import { Reimbursement } from "../models/Reimbursement";
import { ReimbursementDTO } from "../dtos/ReimbursementDTO";
import {
  daofindReimbursementByStatusId,
  daofindReimbursementByUserId,
  daoSaveOneReimbursement,
  daoUpdateReimbursement
} from "../repositories/reimbursement-dao";

export async function findReimbursementByStatusId(
  id: number
): Promise<Reimbursement[]> {
  return await daofindReimbursementByStatusId(id);
}

export async function findReimbursementByUserId(
  id: number
): Promise<Reimbursement[]> {
  return await daofindReimbursementByUserId(id);
}

export async function saveOneReimbursement(
  newReimbursement: ReimbursementDTO
): Promise<Reimbursement> {
  return await daoSaveOneReimbursement(newReimbursement);
}

export async function updateReimbursement(
  newReimbursement: Reimbursement
): Promise<Reimbursement> {
  console.log("in service");

  return await daoUpdateReimbursement(newReimbursement);
}
