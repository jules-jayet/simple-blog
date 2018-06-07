var app = require("../server.js");
var supertest = require("supertest");
var assert = require("chai").assert;

describe("test home page", function () {
	
	it("should have content-type text/html", function (done) {
		supertest(app)
			.get("/")
			.set("User-Agent", "API testing")
			.expect("Content-Type", "text/html; charset=utf-8")
			.expect(200)
			.end(done);
	});
	
	it("should have title \"Simple blog\"", function (done) {
		supertest(app)
			.get("/")
			.set("User-Agent", "API testing")
			.expect(function (res) {
				assert(res.text.includes("<title>Simple blog</title>"));
			})
			.expect(200)
			.end(done);
	});

});

describe("test articles page", function () {
	
	it("should have at least one article", function (done) {
		supertest(app)
			.get("/articles")
			.set("User-Agent", "API testing")
			.expect(function (res) {
				assert(res.text.includes("article-container"));
			})
			.expect(200)
			.end(done);
	});

});

describe("test new article page", function () {
	
	it("should have form", function (done) {
		supertest(app)
			.get("/new-article")
			.set("User-Agent", "API testing")
			.expect(function (res) {
				assert(res.text.includes("</form>"));
			})
			.expect(200)
			.end(done);
	});

});

describe("test admin page", function () {
	
	it("should have table", function (done) {
		supertest(app)
			.get("/admin")
			.set("User-Agent", "API testing")
			.expect(function (res) {
				assert(res.text.includes("</table>"));
			})
			.expect(200)
			.end(done);
	});

	it("should have at least one article", function (done) {
		supertest(app)
			.get("/admin")
			.set("User-Agent", "API testing")
			.expect(function (res) {
				assert(res.text.includes("article-row"));
			})
			.expect(200)
			.end(done);
	});

})