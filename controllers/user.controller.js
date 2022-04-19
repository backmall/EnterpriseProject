exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
exports.loginPage = (req, res)=>{
  res.render("../views/login.ejs");
}
exports.registerPage = (err, res)=>{
  res.render("../views/register.ejs");
}
exports.alreadyLogged = (req, res)=>{
  res.render("../views/index.ejs");
}
exports.profilePage = (req, res)=>{
  console.log("___");
  console.log(req.params.userId);
  res.status(200).send("query " + req.params.userId);
}