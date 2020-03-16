import { PoolClient } from "pg";
import { connectionPool } from ".";
import { User } from "../models/User";
import { BadCredentialsError } from "../errors/BadCredentialsError";
import { InternalServerError } from "../errors/InternalServerError";
import { userDTOToUserConverter } from "../util/user-dto-to-user-converter";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { findUserById } from "../services/user-service";

export async function daoFindUserByUsernameAndPassword(
  username: string,
  password: string
): Promise<User> {
  let client: PoolClient; // our potential connection to db
  try {
    client = await connectionPool.connect();
    // a paramaterized query
    let results = await client.query(
      'SELECT * FROM project0."User" U inner join project0."Role" R on U."role" = R.role_id  WHERE username = $1  and "password" = $2',
      [username, password]
    );

    if (results.rowCount === 0) {
      throw new Error("User Not Found");
    }
    return userDTOToUserConverter(results.rows[0]);
  } catch (e) {
    console.log(e);
    if (e.message === "User Not Found") {
      throw new BadCredentialsError();
    } else {
      throw new InternalServerError();
    }
  } finally {
    client && client.release();
  }
}

// this function gets anf formats all users
export async function daoFindAllUsers(): Promise<User[]> {
  let client: PoolClient;

  try {
    client = await connectionPool.connect();
    let results = await client.query(
      'SELECT * FROM project0."User" U inner join project0."Role" R on U."role" = R.role_id ORDER BY U.user_id'
    );
    return results.rows.map(userDTOToUserConverter);
  } catch (e) {
    throw new InternalServerError();
  } finally {
    client && client.release();
  }
}

// function that updates a user and returns the updated user
export async function daoUpdateUser(newUser: User): Promise<User> {
  let client: PoolClient;
  try {
    client = await connectionPool.connect();

    let userId = newUser.userId;
    //the non updated user row
    let oldUser = await findUserById(userId);

    //use default to set new variables (new vars to old vars if they exist)
    oldUser.username = newUser.username || oldUser.username;
    oldUser.firstName = newUser.firstName || oldUser.firstName;
    oldUser.lastName = newUser.lastName || oldUser.lastName;
    oldUser.email = newUser.email || oldUser.email;
    oldUser.role = newUser.role || oldUser.role;

    // send an insert that uses the id above and the user input
    await client.query(
      'UPDATE project0."User" set username = $1, first_name = $2, last_name = $3, email = $4, role = $5 WHERE user_id = $6',
      [
        oldUser.username,
        oldUser.firstName,
        oldUser.lastName,
        oldUser.email,
        oldUser.role.roleId,
        userId
      ]
    );

    return oldUser; // convert and send back
  } catch (e) {
    throw new InternalServerError();
  } finally {
    client && client.release();
  }
}

export async function daoFindUserById(id: number): Promise<User> {
  let client: PoolClient;
  try {
    client = await connectionPool.connect();
    let result = await client.query(
      'SELECT * FROM project0."User" U inner join project0."Role" R on U."role" = R.role_id WHERE U.user_id = $1',
      [id]
    );
    if (result.rowCount === 0) {
      throw new Error("User Not Found");
    }
    return userDTOToUserConverter(result.rows[0]);
  } catch (e) {
    // id DNE
    //need if for that
    if (e.message === "User Not Found") {
      throw new UserNotFoundError();
    }
    throw new InternalServerError();
  } finally {
    client && client.release();
  }
}
