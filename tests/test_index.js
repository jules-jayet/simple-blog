var app = require("../server.js");
var supertest = require("supertest");
var assert = require("chai").assert;

describe("test blog index endpoint", function() {
  it("should have content-type text/html", function(done) {
    supertest(app)
      .get("/")
      .set("User-Agent", "API testing")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect(200)
      .end(done);
  });
  it("should have title \"Simple Blog\"", function(done) {
      supertest(app)
      .get("/")
      .set("User-Agent", "API testing")
      .expect(function(res) {
        assert(res.text.includes("<title>Simple Blog</title>"));
      })
      .expect(200)
      .end(done);
});
})
