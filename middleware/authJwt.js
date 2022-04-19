const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;


getProfile = (req, res, next)=>{
  let token = req.session.token;
  //not logged in
  if(!token){
    if(req.params.userId){
      //basic profile
      console.log("getProfile-no token");
      return res.render("../views/home.ejs");;
    }
    else{
      console.log(" no Profile specified-no token")
      return res.status(403).send({ message: "Unathorized! no id no token" });
    }
  }
  //logged in
  else if(token){
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      console.log("decoded.id:");
      console.log(decoded.id)
      req.userId = decoded.id;
    });
    if(!req.params.userId){
      //own profile edit
      console.log("own profile edit")
      return res.status(200).send({message: "own profile edit"});
    }
    else if(req.params.userId){
      //logged in own profile
      if(req.params.userId == req.userId){
        //own profile edit
        console.log("own profile edit")
        return res.status(200).send({message: "own profile edit"});
      }
      else{
        //admin edit
        User.findById(req.userId).exec((err, user) => {
          Role.find(
            {
              _id: { $in: user.roles },
            },
            (err, roles) => {
              for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                  console.log("im admin");
                  return res.status(200).send({message: "admin edit"});
                }
              }
              console.log("somebdoies profile no edit");
              return res.status(200).send({message: "somebdoies profile no edit"})
            }
          );
        });
      }
    }

  }
}

isLogged = (req, res, next) =>{
  let token = req.session.token;
  if(!token){
    next();
  }
  else{
    jwt.verify(token, config.secret, (err) => {
      if (!err) {
        return res.render("../views/home.ejs");
      }
    });
  }
};

verifyToken = (req, res, next) => {
  let token = req.session.token;
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    console.log("decoded.id:");
    console.log(decoded.id)
    req.userId = decoded.id;
    next();
  });
};
isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }
        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};
const authJwt = {
  verifyToken,
  isAdmin,
  isLogged,
  getProfile
};
module.exports = authJwt;