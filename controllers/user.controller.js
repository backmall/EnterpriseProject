exports.loginPage = (req, res)=>{
  res.render("../views/login.ejs");
}
exports.registerPage = (err, res)=>{
  res.render("../views/register.ejs");
}
exports.alreadyLogged = (req, res)=>{
  res.render("../views/index.ejs");
}