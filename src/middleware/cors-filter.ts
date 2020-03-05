import { Request, Response } from "express";

export function corsFilter(req: Request, res: Response, next) {
  // THIS IS A HACK! DON'T DO THIS IN A REAL APP
  // first param is name, second param is comma separated list of allowed hosts
  res.header("Acess-Control-Allow-Origin", `${req.headers.origin}`);
  // first param is name, second param is comma separated list of allowed headers
  res.header("Acess-Control-Allow-Headers", "Origin,Content-Type,Accept"); //see demos
  //
  res.header("Acess-Control-Allow-Credentials", "true");

  //pre flight response
  if (req.method === "OPTIONS") {
    //if they send an options request
    res.sendStatus(200);
  } else {
    next();
  }
}
