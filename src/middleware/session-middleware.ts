import * as session from "express-session";

const sessionConfig = {
  secret: "secret",
  cookie: { secure: false },
  resave: false,
  saveUninitialized: false
};

//Attaches an object to the request
export const sessionMiddleware = session(sessionConfig);
