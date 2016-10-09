var express = require('express'); //handles the server related tasks gets posts...
var app = express();

var mongojs = require('mongojs'); //handles database access to the mongodb instance running locally
var db = mongojs('@localhost/contactlist', ['contactlist'], {authMechanism: 'ScramSHA1'}); //secure login

var bodyParser = require('body-parser'); //handles the parsing of the response body passed back to the server

app.use(express.static(__dirname + "/public")) //define the root of your server
app.use(bodyParser.json()); //Tell the bodyParser to return json

app.get('/contactlist', function (req, res) {
	db.contactlist.find(function(err, docs) {
		res.json(docs);
	});
});

app.post('/contactlist', function (req, res) {	//console.log(req.body);
	db.contactlist.insert(req.body, function(err, docs){
		res.json(docs);
	});
});

app.delete('/contactlist/:id', function (req, res) {
	var id = req.params.id; //console.log(id);

	db.contactlist.remove({_id: mongojs.ObjectId(id)}, function (err, docs) {
		res.json(docs);
	});
});

app.get('/contactlist/:id', function (req, res) {
	var id = req.params.id;	// console.log(id);

	db.contactlist.findOne({_id: mongojs.ObjectId(id)}, function (err, docs) {
		res.json(docs);
	});
});

app.put('/contactlist/:id', function (req, res) {
	var id = req.params.id; // console.log(req.body.name);

	db.contactlist.findAndModify({query: {_id: mongojs.ObjectId(id)},
		update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number}},
		new: true}, function (err, docs) {
			res.json(docs);
	});	
});

app.listen(3000);
console.log("Server running on port 3000");