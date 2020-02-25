import { ReimbursementDTO } from "../dtos/ReimbursementDTO";
import { Reimbursement } from "../models/Reimbursement";

export function reimbursementDTOToReimbursementConverter(
  reimbursementDTO: ReimbursementDTO
): Reimbursement {
  return new Reimbursement(
    reimbursementDTO.reimbursement_id,
    reimbursementDTO.author,
    reimbursementDTO.amount,
    reimbursementDTO.date_submitted,
    reimbursementDTO.date_resolved,
    reimbursementDTO.description,
    reimbursementDTO.resolver,
    reimbursementDTO.status,
    //reimbursementDTO.status_id,
    reimbursementDTO.type
  );
}
