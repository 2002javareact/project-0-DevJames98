export class ReimbursementStatusDTO {
  status_id: number; // primary key
  status: string; // not null, unique

  //add constructor
  constructor(status_id: number, status: string) {
    this.status_id = status_id;
    this.status = status;
  }
}
