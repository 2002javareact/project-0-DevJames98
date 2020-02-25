export class ReimbursementStatus {
  statusId: number; // primary key
  status: string; // not null, unique

  //add constructor
  constructor(statusId: number, status: string) {
    this.statusId = statusId;
    this.status = status;
  }
}
