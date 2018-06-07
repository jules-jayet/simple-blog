var app = require("../server.js");
var supertest = require("supertest");
var assert = require("chai").assert;
var MongoClient = require("mongodb");

var baseApi = "/api";
var url = process.env.URL || "mongodb://localhost:27017/simpleblog";
var dbName = process.env.DBNAME || "simpleblog";

describe("test if API is alive", function () {
	
	it("should have hello message on get /api/", function (done) {
		supertest(app)
			.get(baseApi)
			.set("User-Agent", "API testing")
			.expect(function (res) {
				assert.exists(res.body.message);
				assert.equal(res.body.message, "Welcome on blog API");
			})
			.expect(200)
			.end(done);
	});

});

describe("test articles on API", function () {

	// Used to catch objects from API.
	var articlesFromDB = [];
	var insertedArticle = {};
	var articlesCollection;

	// Connect to database.
	before(function(done) {
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
			var db = client.db(dbName);
			articlesCollection = db.collection('articles');
			// Get articles from DB.
			articlesCollection.find({}).toArray(function(_err, result) {
				if (!_err) articlesFromDB = result;
				done(err || _err);
			});
			

		});
	});

	it("should have at least one article from API", function (done) {
		supertest(app)
			.get(baseApi + "/articles")
			.set("User-Agent", "API testing")
			.expect(function (res) {
				assert.isAtLeast(res.body.articles.length, 1);
			})
			.expect(200)
			.end(done);
	});

	it("should have same articles number from API & database", function (done) {
		supertest(app)
			.get(baseApi + "/articles")
			.set("User-Agent", "API testing")
			.expect(function (res) {
				assert.equal(res.body.articles.length, articlesFromDB.length);
			})
			.expect(200)
			.end(done);
	});

	it("should have article by id from API", function (done) {
		supertest(app)
			.get(baseApi + "/articles/" + articlesFromDB[0]._id)
			.set("User-Agent", "API testing")
			.expect(function (res) {
				assert.exists(res.body, "article is undefined");
				assert.exists(res.body._id, "_id is undefined");
				assert.exists(res.body.title, "title is undefined");
				assert.exists(res.body.resume, "resume is undefined");
				assert.exists(res.body.content, "content is undefined");
				assert.exists(res.body.author, "author is undefined");
				assert.exists(res.body.date, "date is undefined");
			})
			.expect(200)
			.end(done);
	});

	it("should be unable to create a wrong article on API", function (done) {
		supertest(app)
			.post(baseApi + "/articles")
			.send({
				hello: "world"
			})
			.set("User-Agent", "API testing")
			.expect(400)
			.end(done);
	});

	it("should be able to create a new article on API", function (done) {
		supertest(app)
			.post(baseApi + "/articles")
			.send({
				title: "test title",
				resume: "test resume",
				content: "test content",
				author: "test author"
			})
			.set("User-Agent", "API testing")
			.expect(function (res) {
				insertedArticle = res.body
				assert.exists(insertedArticle, "article is undefined");
				assert.exists(insertedArticle._id, "_id is undefined");
				assert.exists(insertedArticle.title, "title is undefined");
				assert.exists(insertedArticle.resume, "resume is undefined");
				assert.exists(insertedArticle.content, "content is undefined");
				assert.exists(insertedArticle.author, "author is undefined");
				assert.exists(insertedArticle.date, "date is undefined");
			})
			.expect(200)
			.end(done);
	});

	it("should be able to delete an article by id on API", function (done) {
		supertest(app)
			.delete(baseApi + "/articles/" + insertedArticle._id)
			.set("User-Agent", "API testing")
			.expect(function (res) {

				// Article is really deleted?
				articlesCollection.find({}).toArray(function(_err, result) {
					if (!_err) articlesFromDB = result;
					var deletedArticleIndex = -1;
					articlesFromDB.forEach(function(article, index) {
						if (article._id == insertedArticle._id) deletedArticleIndex = index;
					});
					assert.equal(deletedArticleIndex, -1);
				});

			})
			.expect(200)
			.end(done);
	});
	

});