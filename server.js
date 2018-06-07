var express = require("express");
var MongoClient = require("mongodb");
var bodyParser = require("body-parser")
var cons = require("consolidate");
var morgan = require("morgan");

// Configure app.
var app = express();
var url = process.env.URL || "mongodb://localhost:27017/simpleblog";
var dbName = process.env.DBNAME || "simpleblog";
var port = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get env.
var env = process.env.NODE_ENV || "dev"; // dev | test | prod

// Configure pug.
app.engine("html", cons.pug);
app.set("view engine", "pug");
app.set("views",  __dirname +  "/views");

// Configure HTTP auto logger (morgan).
if (env == "dev") app.use(morgan("dev"));
else if (env == "prod") app.use(morgan("combined"));

// Configure pagination.
app.articlesPerPage = 2;

// Require API & webapp routes.
var api = require("./api/routes");
var webapp = require("./webapp/routes");

// Connect to database.
MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {

	// Logs.
	if (err) {
		if (env == "dev") console.log("Unable to connect to mongo database :", err);
		throw err;
	}
	else {
		if (env == "dev") console.log("Successfully connected to database...");
	}

	// Link database to app.
	app.client = client;
	app.db = client.db(dbName);

	// Configure base API URI.
	app.baseApi = "/api";

	// Expose port on app.
	app.port = port;

	// Use API & webapp routes.
	api(app);
	webapp(app);

	// Start the server.
	app.listen(port, function() {
		if (env == "dev") console.log("App is running on http://localhost:" + port + "...");
	});

});

module.exports = app;
