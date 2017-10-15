const SQLite = require('sqlite3').verbose();
var db = new SQLite.Database("data.db");

DATA = {};

DATA.findMV = function(tomo, callback) {
	var qry = "select e.des_estado, m.des_municipio, p.des_parroquia, c.codigo, c.nombre from centros c " +
		"inner join parroquias p on p.par = substr(c.codigo,1,6) " +
		"inner join municipios m on m.mun = substr(c.codigo,1,4) " +
		"inner join estados e on e.edo = substr(c.codigo,1,2) where c.codigo= '" + tomo.substr(0,9) + "';"
	db.all(qry, function(err, rows) {
		callback(err, rows);
	});
}

DATA.registerGroup = (group_id, callback) => {
	let grp = db.prepare("insert into groups values (?)");
	grp.run(group_id);
	grp.finalize();
}

DATA.getGroups = (callback) => {
	let qry = "select * from groups;";
	db.all(qry, (err, rows) => {
		callback(err, rows);
	});
}

DATA.registerAprovers = (user_id) => {
	let apr = db.prepare("insert into aprovers values (?)");
	apr.run(user_id);
	apr.finalize();
}

DATA.getAprovers = (callback) => {
	let qry = "select * from aprovers;";
	db.all(qry, (err, rows) => {
		callback(err, rows);
	});
}

DATA.pCero = () => {
	db.run("delete from groups;");
	db.run("delete from aprovers");
}

module.exports = DATA;