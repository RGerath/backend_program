require('isomorphic-fetch');

//	express initialization
const express = require('express');
const app = express();

const MOCKAPI_URL = "https://609aae2c0f5a13001721bb02.mockapi.io/lightfeather/managers";
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//	GET endpoint - retrieve, parse, and order list of supervisors
app.get('/api/supervisors', async (req, res) => {
	//	RETRIEVE
	fetch(MOCKAPI_URL).then(function(response) {
	  response.text().then(function(text) {
			var mockapiData = text;
			//	PARSE
			mockapiData = mockapiData.slice(2, -2);
			//console.log(mockapiData);
			var splitData = mockapiData.split("},{");
			var stringList = [];
			splitData.forEach(function (elem, indx) {
				datum = JSON.parse("{".concat(elem).concat("}"));
				//console.log(datum);
				//	omit any supervisors with numeric jurisdictions
				if (isNaN(datum['jurisdiction'])){
					newString = datum['jurisdiction'].concat(" - ").concat(datum['lastName'].concat(", ").concat(datum['firstName']));
					stringList.push(newString);
					//console.log(newString);
				}
			});
			//	ORDER
			merge = function (l, r) {
				var arr = [];
				//	merge l and r to arr based on comparative lowest alphabetic values
				while (l.length && r.length) {
					if (l[0].localeCompare(r[0]) <= 0) {
						arr.push(l.shift());
					} else {
						arr.push(r.shift());
					}
				}
				//	return arr, appended by leftover highest value from l or r
				return arr.concat(l).concat(r);
			};
			mergesort = function (arr) {
				//	base case
				if (arr.length < 2) {
					return arr;
				}
				//	splice arr in twain
				var half = arr.length / 2;
				var l = arr.splice(0, half);
				return merge(mergesort(l), mergesort(arr));
			};
			stringList = mergesort(stringList);
			//	RETURN
			//console.log(stringList);
			return stringList;
	  });
	});
});

//	POST endpoint - post [FirstName*, LastName*, Email, Phone, Supervisor*] and print response to console
app.post('/api/submit', (req, res) => {
	//	check if required fields were passed
	var response = "";
	if (!req.body.FirstName || !req.body.LastName || !req.body.Supervisor) {
		response = "Missing required field";
	} else {
		//	extract information from req body
		response = "Received\nFirst Name: ".concat(req.body.FirstName);
		response = response.concat("\nLast Name: ").concat(req.body.LastName);
		if (req.body.Email) { response = response.concat("\nEmail: ").concat(req.body.Email); }
		if (req.body.Phone) { response = response.concat("\nPhone: ").concat(req.body.Phone); }
		response = response.concat("\nSupervisor: ").concat(req.body.Supervisor);
	}
	console.log(response);
	res.send(response);
});

//	server port (for testing)
app.listen(5000);
