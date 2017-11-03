const SQLite = require('sqlite3').verbose();
var db = new SQLite.Database("data.db");

GEO = {};

GEO.getState = (code) => {
	var p = new Promise((resolve, reject) => {
		let qry = `select * from estados where cod = '${code.substr(0,2)}';`;
		db.get(qry, (err, data) => {
			if(err) {
				reject(err);
			} else {
				resolve(data);
			}
		})
	});

	return p;
}

GEO.getMunicipality = (code) => {
	var p = new Promise((resolve, reject) => {
		let qry = `select * from municipios where cod = '${code.substr(0,4)}';`;
		db.get(qry, (err, data) => {
			if(err) {
				reject(err);
			} else {
				resolve(data);
			}
		})
	});

	return p;
}

GEO.getParish = (code) => {
	var p = new Promise((resolve, reject) => {
		let qry = `select * from parroquias where cod = '${code.substr(0,6)}';`;
		db.get(qry, (err, data) => {
			if(err) {
				reject(err);
			} else {
				resolve(data);
			}
		})
	});

	return p;
}

GEO.getPollingPlace = (code) => {
	var p = new Promise((resolve, reject) => {
		let qry = `select * from centros where cod = '${code.substr(0,9)}';`;
		db.get(qry, (err, data) => {
			if(err) {
				reject(err);
			} else {
				resolve(data);
			}
		})
	});

	return p;
}
module.exports = GEO;