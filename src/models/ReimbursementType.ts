export class ReimbursementType {
  typeId: number; // primary key
  type: string; // not null, unique

  //add constructor
  constructor(typeId: number, type: string) {
    this.typeId = typeId;
    this.type = type;
  }
}
