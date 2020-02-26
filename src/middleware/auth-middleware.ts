// big rule, always call either res or next
//TO EDIT

export const authFactory = (roles: string[]) => {
  return (req, res, next) => {
    // this checks that you are logged in
    if (!req.session.user) {
      res.status(401).send("Please Login");
    } else {
      let allowed = false;
      // loop through all of the allowed roles
      for (let role of roles) {
        // see if user has a matching role
        if (req.session.user.role.role === role) {
          allowed = true;
          next();
        }
      }
      if (!allowed) {
        res.status(403).send("The incoming token has expired");
      }
    }
  };
};

// match user id to path param id
export const authCheckId = (req, res, next) => {
  //TODO
  // Allow through automatically, people that aren't users

  if (
    req.session.user.role.role === "Admin" ||
    req.session.user.role.role === "Finance-Manager"
  ) {
    next();
  } else if (req.session.user.userId === +req.params.id) {
    next();
  } else {
    res.status(403).send("The incoming token has expired");
  }
};
