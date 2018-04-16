var posts = require("./posts");

module.exports = function(app) {

  app.get("/", function(req, res) {
    res.render("index");
  });

  // Register posts endpoint
  posts(app);
}
