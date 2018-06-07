var ObjectId = require("mongodb").ObjectID;

module.exports = function (app) {

	// Get articles collection.
	var articlesCollection = app.db.collection('articles');

	// Endpoint used to say hello.
	app.get(app.baseApi + "/", function (req, res) {
		res.status(200).json({
			message: "Welcome on blog API"
		});
	});

	// Endpoint used to get all articles.
	app.get(app.baseApi + "/articles", function (req, res) {

		// Pagination (optionnal, if no param -> no limit).
		var page = Number(req.query.p);
		var limit;
		if (!page) {
			firstArticle = 0;
			limit = 0;
		}
		else {
			var offset = (page - 1) * app.articlesPerPage;
			firstArticle = 0 + offset;
			limit = app.articlesPerPage;
		}

		// Get articles number.
		articlesCollection.find({}).count(function (err, count) {
			if (err) {
				console.error("Error on get articles: " + err);
				res.status(500).json({
					error: "Unable to retrieve articles"
				});
			}
			else {

				// Get articles from database.
				articlesCollection.find({}).skip(firstArticle).limit(limit).toArray(function (err, result) {
					if (err) {
						console.error("Error on get articles: " + err);
						res.status(500).json({
							error: "Unable to retrieve articles"
						});
					}
					else {
						res.status(200).json({
							articles: result,
							totalCount: count
						});
					}
				});

			}
		});

	});

	// Endpoint used to get an article by id.
	app.get(app.baseApi + "/articles/:id", function (req, res) {

		var articleId = req.params.id;

		// Get article by id from database.
		articlesCollection.find({ "_id": ObjectId(articleId) }).toArray(function (err, result) {
			if (err) {
				console.error("Error on get article by id: " + err);
				res.status(500).json({
					error: "Unable to retrieve article by id"
				});
			}
			else {
				if (!result.length) {
					res.status(404).json({
						error: "Article not found"
					});
				}
				else {
					res.status(200).json(result[0]);
				}
			}
		});

	});

	// Endpoint used to delete an article by id.
	app.delete(app.baseApi + "/articles/:id", function (req, res) {

		var articleId = req.params.id;

		// Get article by id from database.
		articlesCollection.deleteOne({ "_id": ObjectId(articleId)}, function (err, result) {
			if (err) {
				console.error("Unable to delete article by id: " + err);
				res.status(500).json({
					error: "Unable to delete article by id"
				});
			}
			else {
				res.status(200).json({
					message: "Article successfully deleted"
				});
			}
		});

	});

	// Endpoint used to create an article comment.
	app.post(app.baseApi + "/articles/:id/comments", function (req, res) {

		var articleId = req.params.id;
		var comment = req.body;

		// Invalid comment.
		if (
			typeof comment.author != "string" ||
			typeof comment.content != "string"
		) {
			res.status(400).json({
				error: "Comment not valid"
			});
		}
		else {
			articlesCollection.update(
				{ "_id": ObjectId(articleId) },
				{ $addToSet: { comments: {
					author: comment.author,
					content: comment.content,
					date: new Date()
				} }}
			);
			res.status(200).json({});
		}

	});

	// Endpoint used to create an article.
	app.post(app.baseApi + "/articles", function (req, res) {

		var article = req.body;

		// Invalid article?
		if (
			typeof article.title != "string" ||
			typeof article.resume != "string" ||
			typeof article.content != "string" ||
			typeof article.author != "string"
		) {
			res.status(400).json({
				error: "Article not valid"
			});
		}
		else {

			// Insert the article.
			articlesCollection.insert(
				{
					title: article.title,
					resume: article.resume,
					content: article.content,
					author: article.author,
					date: new Date(),
					comments: []
				}, function (err, result) {

					if (err) {
						console.error("Unable to create a new article: " + err);
						res.status(500).json({
							error: "Unable to create a new article"
						});
					}
					else {
						res.status(200).json(result.ops[0]);
					}

				});

		}

	});

};
