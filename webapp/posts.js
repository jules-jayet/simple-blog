var request = require("request");

module.exports = function (app) {

	// Get the webapp URL.
	var webapp = "http://localhost:" + app.port;

	// Get the API URI.
	var api = "http://localhost:" + app.port + app.baseApi;

	// Route used to create an article (create form).
	app.post("/post/create-article", function (req, res) {

		var article = req.body;

		// Create the article (via API).
		request.post({
			url: api + "/articles",
			form: article
		}, function (err, result, body) {

			// Redirect to /articles.
			res.redirect(webapp + "/articles");

		});

	});

	// Route used to delete an article (delete form).
	app.post("/post/delete-article", function (req, res) {

		var articleId = req.body.articleId;

		// Delete the article (via API).
		request.delete({
			url: api + "/articles/" + articleId
		}, function (err, result, body) {

			// Redirect to /admin (will reload page).
			res.redirect(webapp + "/admin");

		});

	});

	// Route used to create a comment (create form).
	app.post("/post/create-comment", function (req, res) {

		var articleId = req.body.articleId;

		var comment = {
			author: req.body.author,
			content: req.body.content,
		};

		// Create the comment (via API).
		request.post({
			url: api + "/articles/" + articleId + "/comments",
			form: comment
		}, function (err, result, body) {

			// Redirect to article details page.
			res.redirect(webapp + "/articles/" + articleId);

		});

	});

};
