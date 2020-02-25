export class ReimbursementTypeDTO {
  type_id: number; // primary key
  type: string; // not null, unique

  //add constructor
  constructor(type_id: number, type: string) {
    this.type_id = type_id;
    this.type = type;
  }
}
