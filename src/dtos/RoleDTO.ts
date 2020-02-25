export class RoleDTO {
  role_id: number;
  role: string;

  constructor(role_id: number, role: string) {
    this.role_id = role_id;
    this.role = role;
  }
}
