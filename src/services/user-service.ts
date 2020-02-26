import {
  daoFindUserByUsernameAndPassword,
  daoFindAllUsers,
  daoUpdateUser,
  daoFindUserById
} from "../repositories/user-dao";
import { User } from "../models/User";

export async function findUserByUsernameAndPassword(
  username: string,
  password: string
): Promise<User> {
  return await daoFindUserByUsernameAndPassword(username, password);
}

export async function findAllUsers(): Promise<User[]> {
  return await daoFindAllUsers();
}

export async function updateUser(newUser: User): Promise<User> {
  return await daoUpdateUser(newUser);
}

export async function findUserById(id: number): Promise<User> {
  return await daoFindUserById(id);
}
