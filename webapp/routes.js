var request = require("request");
var posts = require("./posts");
var tools = require("../tools");

module.exports = function (app) {

	// Get the API URI.
	var api = "http://localhost:" + app.port + app.baseApi;

	// Require posts routes (used to post data).
	posts(app);

	// Home page.
	app.get("/", function (req, res) {
		res.render("home");
	});

	// Articles page.
	app.get("/articles", function (req, res) {

		// Pagination param ?
		var page = Number(req.query.p);
		if (!page) page = 1;

		// Get articles from API.
		request(api + "/articles?p=" + page, { json: true }, function (err, result, body) {

			var articles = [];
			var totalCount = 0;
			if (!err) {
				articles = body.articles;
				totalCount = body.totalCount;
			}

			// Bind articles to the view.
			res.render("articles", {
				articles: articles,
				page: page,
				prevExists: page > 1,
				nextExists: totalCount > (page * app.articlesPerPage)
			});

		});

	});

	// Article details page.
	app.get("/articles/:id", function (req, res) {

		var articleId = req.params.id;

		// Get article by id from API.
		request(api + "/articles/" + articleId, { json: true }, function (err, result, body) {

			var article = {};
			if (!err) {
				article = body;
				article.date = tools.niceDate(article.date);

				// Parse comments date.
				if (article && article.comments && article.comments.length) {
					article.comments.forEach(function (comment) {
						comment.date = tools.niceDate(comment.date);
					});
				}

			}

			// Bind articles to the view.
			res.render("article-details", {
				article: article
			});

		});

	});

	// New article page.
	app.get("/new-article", function (req, res) {
		res.render("new-article");
	});

	// Admin page.
	app.get("/admin", function (req, res) {

		// Get articles from API.
		request(api + "/articles", { json: true }, function (err, result, body) {

			var articles = [];
			if (!err) {
				articles = body.articles;
			}

			// Parse articles dates.
			articles.forEach(function (article) {
				article.date = tools.niceDate(article.date);
			});

			// Bind articles to the view.
			res.render("admin", {
				articles: articles
			});

		});

	});

};
