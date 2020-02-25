import { UserDTO } from "../dtos/UserDTO";
import { User } from "../models/User";
import { Role } from "../models/Role";
import { RoleDTO } from "../dtos/RoleDTO";

export function userDTOToUserConverter(userDTO: UserDTO): User {
  //console.log(new Role(userDTO.role.role_id, userDTO.role.role));
  //console.log(new RoleDTO(userDTO.role.role_id, userDTO.role.role));

  //let x = new RoleDTO(userDTO.role.role_id, userDTO.role.role);
  //console.log(x);

  return new User(
    userDTO.user_id,
    userDTO.username,
    //userDTO.password,
    userDTO.first_name,
    userDTO.last_name,
    userDTO.email,
    new Role(userDTO.role_id, userDTO.role)
    //new Role(x.role_id, x.role)
  );
}
