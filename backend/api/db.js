var mysql      = require('mysql'),
	common	   = require('./common'),
	async	   = require('async');
var self = false;
var DB = function() {
	self = this;
	this.dbPool = mysql.createPool({
		connectionLimit : 10,
  		host     : 'localhost',
  		database : 'sakila',
  		user     : 'root',
  		password : '1'
	});
}


 DB.prototype.login = function (args) {
	return function(callback){
		if(!args || !args.email || !args.password) return callback(false, common.prepareResponse("Please provide email and password"));
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('SELECT staff_id, first_name, last_name FROM staff WHERE email = ? AND password = ? AND active  = 1 LIMIT 1', [args.email, args.password]), function(err, rows) {
				connection.release();
				console.log(rows);	
			    var errormsg = "";
				if(err || !rows) errormsg = "Invalid Credential";
			    return callback(false, common.prepareResponse(errormsg, rows, "Login Successfully"));
			});
		});
	}
};

DB.prototype.getCustomerList = function (args) {
	if(typeof(args.page) === "undefined" || typeof(args.page) === "object" || !args.page || args.page < 1) args.page = 1;
	if(!args.limit) args.limit = 10;
	else args.limit = parseInt(args.limit);
	args.page = parseInt((args.page * args.limit) - args.limit);
	console.log(args);
	if(!args.orderby) args.orderby = "ID"
	if(!args.ascdesc || args.ascdesc == '0') args.ascdesc = "DESC"
	else args.ascdesc = "ASC"
	
	return function(callback){
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
		var query=mysql.format('select * FROM customer_list WHERE notes = "active" ORDER BY '+ args.orderby +' '+ args.ascdesc +' LIMIT ?, ? ', [args.page, args.limit]);
			connection.query(query, function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no customer.";
			    return callback(false, common.prepareResponse(errormsg, rows));
			});
		});
	}
};

DB.prototype.getCustomerTotalCount = function (args) {
	return function(callback){
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query('SELECT COUNT(ID) as count FROM customer_list WHERE notes = "active"', function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no customer.";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false)));
			});
		});
	}
};

DB.prototype.getNextCustomerID = function (args) {
	if(!args || !args.customerId) return callback(false, common.prepareResponse("Please provide customer id"));
	if(!args.page) args.page = 1;
	args.page = parseInt(args.page) - 1;
	return function(callback){
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('SELECT ID FROM customer_list WHERE ID > ? AND notes = "active" ORDER BY ID DESC LIMIT ?, 1', [args.customerId, args.page]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no customer.";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false)));
			});
		});
	}
};

DB.prototype.getSingleCustomer = function (args) {
	return function(callback){
		if(!args || !args.id) return callback(false, common.prepareResponse("Please provide customer id"));
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('SELECT customer_list.ID, customer_list.name, customer_list.first_name, customer_list.last_name, customer_list.address, customer_list.`zip code` AS zipcode, customer_list.phone, customer_list.district, customer_list.email, customer_list.active, customer_list.city, customer_list.country, customer_list.notes, customer_list.SID, customer_list.city_id, customer_list.country_id FROM customer_list WHERE ID = ? LIMIT 1', [args.id]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "Customer does not exists";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false)));
			});
		});
	}
};

DB.prototype.saveUpdateCustomer = function (args) {
	return function(callback){
		if(!args) return callback(false, common.prepareResponse("Please provide customer information"));
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			// get address id or create new on

			async.waterfall([
				function(cb) {
					connection.query(mysql.format("SELECT address_id FROM address WHERE address = ? AND district = ? AND city_id = ? AND postal_code = ? AND phone = ? LIMIT 1", [args.address, args.district, args.city_id, args.postal_code, args.phone]), function(err, rows){
						var addressId = 0;
						if(err || !rows || rows.length < 1){
							// insert new
							connection.query(mysql.format("INSERT INTO address (address, district, city_id, postal_code, phone) VALUES(?, ?, ?, ?, ?)", [args.address, args.district, args.city_id, args.postal_code, args.phone]), function(err, rows){
								console.log(err);
								cb(false, rows.insertId);		
							});
						}else cb(false, rows[0].address_id);
					});		
				},
				function(addressId, cb) {
					var sql = "";
					if(args.customer_id) {
						sql = mysql.format("UPDATE customer SET store_id = ?, first_name = ?, last_name = ?, email = ?, address_id = ?, active = ? WHERE customer_id = ?", [args.store_id, args.first_name, args.last_name, args.email, addressId, args.active, args.customer_id]);
					}else {
						sql = mysql.format("INSERT INTO customer (store_id, first_name, last_name, email, address_id, active) VALUES (?, ?, ?, ?, ?, ?)", [args.store_id, args.first_name, args.last_name, args.email, addressId, args.active]);
					}

					connection.query(sql, function(err, result){
						var errormsg = "";
			    		if(err || !result) errormsg = "Customer save changes failed";
			    		if(result.insertId) args.customer_id = result.insertId;
			    		cb(false, common.prepareResponse(errormsg, args, "Customer save changed successfully"));
					});
				}
			], function(err, result){
				callback(false, result);
			});
		});
	}
};

DB.prototype.deleteCustomer = function (args) {
	return function(callback){
		if(!args || !args.id) return callback(false, common.prepareResponse("Please provide customer id"));
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('UPDATE customer SET active = 0 WHERE customer_id = ?', [args.id]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "Delete customer failed";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false), "Customer deleted successfully"));
			});
		});
	}
};

DB.prototype.getStoreList = function (args) {
	return function(callback){		
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query('SELECT SID, name FROM staff_list', function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no store.";
			    return callback(false, common.prepareResponse(errormsg, rows));
			});
		});
	}
};

DB.prototype.getCountryList = function (args) {
	return function(callback){
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query('SELECT country_id, country FROM country', function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no country.";
			    return callback(false, common.prepareResponse(errormsg, rows));
			});
		});
	}
};

DB.prototype.getCityListByCountryId = function (args) {
	if(!args || !args.country_id) return callback(false, common.prepareResponse("Please provide country id"));
	return function(callback){
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('SELECT city_id, city FROM city WHERE country_id = ?', [args.country_id]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no city.";
			    return callback(false, common.prepareResponse(errormsg, rows));
			});
		});
	}
};

/* Country */
DB.prototype.getCountryListData = function (args) {
	if(typeof(args.page) === "undefined" || typeof(args.page) === "object" || !args.page || args.page < 1) args.page = 1;
	if(!args.limit) args.limit = 10;
	else args.limit = parseInt(args.limit);
	args.page = parseInt((args.page * args.limit) - args.limit);
	
	if(!args.orderby) args.orderby = "country_id"
	if(!args.ascdesc || args.ascdesc == '0') args.ascdesc = "DESC"
	else args.ascdesc = "ASC"
	
	return function(callback){
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('SELECT country_id, country FROM country ORDER BY '+ args.orderby +' '+ args.ascdesc +' LIMIT ?, ? ', [args.page, args.limit]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no country.";
			    return callback(false, common.prepareResponse(errormsg, rows));
			});
		});
	}
};

DB.prototype.getCountryTotalCount = function (args) {
	return function(callback){
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query('SELECT COUNT(country_id) as count FROM country', function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no country.";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false)));
			});
		});
	}
};

DB.prototype.getNextCountryID = function (args) {
	if(!args || !args.countryId) return callback(false, common.prepareResponse("Please provide country id"));
	if(!args.page) args.page = 1;
	args.page = parseInt(args.page) - 1;
	return function(callback){
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('SELECT country_id FROM country WHERE country_id > ? ORDER BY country_id DESC LIMIT ?, 1', [args.countryId, args.page]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no country.";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false)));
			});
		});
	}
};

DB.prototype.getSingleCountry = function (args) {
	return function(callback){
		if(!args || !args.id) return callback(false, common.prepareResponse("Please provide country id"));
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('SELECT country.country_id, country.country FROM country WHERE country_id = ? LIMIT 1', [args.id]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "Country does not exists";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false)));
			});
		});
	}
};

DB.prototype.saveUpdateCountry = function (args) {
	return function(callback){
		if(!args) return callback(false, common.prepareResponse("Please provide country information"));
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			
			var sql = "";
			if(args.country_id) {
				sql = mysql.format("UPDATE country SET country = ? WHERE country_id = ?", [args.country, args.country_id]);
			}else {
				sql = mysql.format("INSERT INTO country (country) VALUES (?)", [args.country]);
			}

			connection.query(sql, function(err, result){
				var errormsg = "";
	    		if(err || !result) errormsg = "Country save changes failed";
	    		if(result.insertId) args.country_id = result.insertId;
	    		callback(false, common.prepareResponse(errormsg, args, "Country save changed successfully"));
			});
		});
	}
};

DB.prototype.deleteCountry = function (args) {
	return function(callback){
		if(!args || !args.id) return callback(false, common.prepareResponse("Please provide country id"));
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('DELETE FROM country WHERE country_id = ?', [args.id]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "Delete country failed";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false), "Country deleted successfully"));
			});
		});
	}
};

/* City */
DB.prototype.getCityListData = function (args) {
	if(typeof(args.page) === "undefined" || typeof(args.page) === "object" || !args.page || args.page < 1) args.page = 1;
	if(!args.limit) args.limit = 10;
	else args.limit = parseInt(args.limit);
	args.page = parseInt((args.page * args.limit) - args.limit);
	
	if(!args.orderby) args.orderby = "city_id"
	if(!args.ascdesc || args.ascdesc == '0') args.ascdesc = "DESC"
	else args.ascdesc = "ASC"
	
	return function(callback){
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('SELECT city_id, city, city.country_id, country.country FROM city INNER JOIN country ON city.country_id = country.country_id ORDER BY '+ args.orderby +' '+ args.ascdesc +' LIMIT ?, ? ', [args.page, args.limit]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no city.";
			    return callback(false, common.prepareResponse(errormsg, rows));
			});
		});
	}
};

DB.prototype.getCityTotalCount = function (args) {
	return function(callback){
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query('SELECT COUNT(city_id) as count FROM city INNER JOIN country ON city.country_id = country.country_id', function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no city.";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false)));
			});
		});
	}
};

DB.prototype.getNextCityID = function (args) {
	if(!args || !args.cityId) return callback(false, common.prepareResponse("Please provide city id"));
	if(!args.page) args.page = 1;
	args.page = parseInt(args.page) - 1;
	return function(callback){
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('SELECT city_id FROM city INNER JOIN country ON city.country_id = country.country_id WHERE city_id > ? ORDER BY city_id DESC LIMIT ?, 1', [args.cityId, args.page]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no city.";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false)));
			});
		});
	}
};

DB.prototype.getSingleCity = function (args) {
	return function(callback){
		if(!args || !args.id) return callback(false, common.prepareResponse("Please provide city id"));
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('SELECT city.city_id, city.city, city.country_id, country.country FROM city INNER JOIN country ON city.country_id = country.country_id WHERE city_id = ? LIMIT 1', [args.id]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "City does not exists";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false)));
			});
		});
	}
};

DB.prototype.saveUpdateCity = function (args) {
	return function(callback){
		if(!args) return callback(false, common.prepareResponse("Please provide city information"));
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			
			var sql = "";
			if(args.city_id) {
				sql = mysql.format("UPDATE city SET city = ?, country_id = ? WHERE city_id = ?", [args.city, parseInt(args.country_id), args.city_id]);
			}else {
				sql = mysql.format("INSERT INTO city (city, country_id) VALUES (?, ?)", [args.city, parseInt(args.country_id)]);
			}

			connection.query(sql, function(err, result){
				console.log(err, sql);
				var errormsg = "";
	    		if(err || !result) errormsg = "City save changes failed";
	    		if(result.insertId) args.city_id = result.insertId;
	    		callback(false, common.prepareResponse(errormsg, args, "City save changed successfully"));
			});
		});
	}
};

DB.prototype.deleteCity = function (args) {
	return function(callback){
		if(!args || !args.id) return callback(false, common.prepareResponse("Please provide city id"));
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('DELETE FROM city WHERE city_id = ?', [args.id]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "Delete city failed";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false), "City deleted successfully"));
			});
		});
	}
};

/* Address */

DB.prototype.getAddressList = function (args) {
	if(typeof(args.page) === "undefined" || typeof(args.page) === "object" || !args.page || args.page < 1) args.page = 1;
	if(!args.limit) args.limit = 10;
	else args.limit = parseInt(args.limit);
	args.page = parseInt((args.page * args.limit) - args.limit);
	console.log(args);
	if(!args.orderby) args.orderby = "address_id"
	if(!args.ascdesc || args.ascdesc == '0') args.ascdesc = "DESC"
	else args.ascdesc = "ASC"
	
	return function(callback){
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('SELECT address.address_id, address.address, address.district, address.city_id, address.postal_code, address.phone, country.country_id, country.country, city.city FROM address INNER JOIN city ON address.city_id = city.city_id INNER JOIN country ON city.country_id = country.country_id ORDER BY '+ args.orderby +' '+ args.ascdesc +' LIMIT ?, ? ', [args.page, args.limit]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no address.";
			    return callback(false, common.prepareResponse(errormsg, rows));
			});
		});
	}
};

DB.prototype.getAddressTotalCount = function (args) {
	return function(callback){
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query('SELECT COUNT(address_id) as count FROM address', function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no address.";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false)));
			});
		});
	}
};

DB.prototype.getNextAddressID = function (args) {
	if(!args || !args.addressId) return callback(false, common.prepareResponse("Please provide address id"));
	if(!args.page) args.page = 1;
	args.page = parseInt(args.page) - 1;
	return function(callback){
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('SELECT address_id FROM address WHERE address_id > ? ORDER BY address_id DESC LIMIT ?, 1', [args.addressId, args.page]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no address.";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false)));
			});
		});
	}
};

DB.prototype.getSingleAddress = function (args) {
	return function(callback){
		if(!args || !args.id) return callback(false, common.prepareResponse("Please provide address id"));
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('SELECT address.address_id, address.address, address.district, address.city_id, address.postal_code, address.phone, country.country_id, country.country, city.city FROM address INNER JOIN city ON address.city_id = city.city_id INNER JOIN country ON city.country_id = country.country_id WHERE address_id = ? LIMIT 1', [args.id]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "Address does not exists";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false)));
			});
		});
	}
};

DB.prototype.saveUpdateAddress = function (args) {
	return function(callback){
		if(!args) return callback(false, common.prepareResponse("Please provide address information"));
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			var sql = "";
			if(args.address_id) {
				sql = mysql.format("UPDATE address SET address = ?, district = ?, city_id = ?, postal_code = ?, phone = ? WHERE address_id = ?", [args.address, args.district, args.city_id, args.postal_code, args.phone, args.address_id]);
			}else {
				sql = mysql.format("INSERT INTO address (address, district, city_id, postal_code, phone) VALUES (?, ?, ?, ?, ?)", [args.address, args.district, args.city_id, args.postal_code, args.phone]);
			}

			connection.query(sql, function(err, result){
				var errormsg = "";
	    		if(err || !result) errormsg = "Address save changes failed";
	    		if(result.insertId) args.address_id = result.insertId;
	    		callback(false, common.prepareResponse(errormsg, args, "Address save changed successfully"));
			});
		});
	}
};

DB.prototype.deleteAddress = function (args) {
	return function(callback){
		if(!args || !args.id) return callback(false, common.prepareResponse("Please provide address id"));
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('DELETE FROM address WHERE address_id = ?', [args.id]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "Delete address failed";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false), "Address deleted successfully"));
			});
		});
	}
};

/* Rental */

DB.prototype.getRentalList = function (args) {
	if(typeof(args.page) === "undefined" || typeof(args.page) === "object" || !args.page || args.page < 1) args.page = 1;
	if(!args.limit) args.limit = 10;
	else args.limit = parseInt(args.limit);
	args.page = parseInt((args.page * args.limit) - args.limit);
	console.log(args);
	if(!args.orderby) args.orderby = "rental_id"
	if(!args.ascdesc || args.ascdesc == '0') args.ascdesc = "DESC"
	else args.ascdesc = "ASC"
	
	return function(callback){
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('SELECT rental.rental_id, rental.rental_date, rental.return_date, rental.inventory_id, rental.customer_id, CONCAT(customer_list.first_name, " ", customer_list.last_name) AS customer_name, rental.return_date, rental.staff_id, CONCAT(staff.first_name, " ", staff.last_name) AS staff_name FROM rental INNER JOIN customer_list ON rental.customer_id = customer_list.ID INNER JOIN inventory ON rental.inventory_id = inventory.inventory_id INNER JOIN staff ON rental.staff_id = staff.staff_id ORDER BY '+ args.orderby +' '+ args.ascdesc +' LIMIT ?, ? ', [args.page, args.limit]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no rental.";
			    return callback(false, common.prepareResponse(errormsg, rows));
			});
		});
	}
};

DB.prototype.getRentalTotalCount = function (args) {
	return function(callback){
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query('SELECT COUNT(rental_id) as count FROM rental INNER JOIN customer_list ON rental.customer_id = customer_list.ID INNER JOIN inventory ON rental.inventory_id = inventory.inventory_id INNER JOIN staff ON rental.staff_id = staff.staff_id', function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no rental.";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false)));
			});
		});
	}
};

DB.prototype.getNextRentalID = function (args) {
	if(!args || !args.rentalId) return callback(false, common.prepareResponse("Please provide rental id"));
	if(!args.page) args.page = 1;
	args.page = parseInt(args.page) - 1;
	return function(callback){
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('SELECT rental_id FROM rental INNER JOIN customer_list ON rental.customer_id = customer_list.ID INNER JOIN inventory ON rental.inventory_id = inventory.inventory_id INNER JOIN staff ON rental.staff_id = staff.staff_id WHERE rental_id > ? ORDER BY rental_id DESC LIMIT ?, 1', [args.rentalId, args.page]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no rental.";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false)));
			});
		});
	}
};

DB.prototype.getSingleRental = function (args) {
	return function(callback){
		if(!args || !args.id) return callback(false, common.prepareResponse("Please provide rental id"));
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('SELECT rental.rental_id, rental.rental_date, rental.return_date, rental.inventory_id, rental.customer_id, CONCAT(customer_list.first_name, " ", customer_list.last_name) AS customer_name, rental.return_date, rental.staff_id, CONCAT(staff.first_name, " ", staff.last_name) AS staff_name FROM rental INNER JOIN customer_list ON rental.customer_id = customer_list.ID INNER JOIN inventory ON rental.inventory_id = inventory.inventory_id INNER JOIN staff ON rental.staff_id = staff.staff_id WHERE rental_id = ? LIMIT 1', [args.id]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "Rental does not exists";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false)));
			});
		});
	}
};

DB.prototype.saveUpdateRental = function (args) {
	return function(callback){
		if(!args) return callback(false, common.prepareResponse("Please provide rental information"));
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			// get address id or create new on
			var sql = "";
			if(args.rental_id) {
				sql = mysql.format("UPDATE rental SET rental_date = ?, inventory_id = ?, customer_id = ?, return_date = ?, staff_id = ? WHERE rental_id = ?", [args.rental_date, args.inventory_id, args.customer_id, args.return_date, args.staff_id, args.rental_id]);
			}else {
				sql = mysql.format("INSERT INTO rental (rental_date, inventory_id, customer_id, return_date, staff_id) VALUES (?, ?, ?, ?, ?)", [args.rental_date, args.inventory_id, args.customer_id, args.return_date, args.staff_id]);
			}

			connection.query(sql, function(err, result){
				var errormsg = "";
	    		if(err || !result) errormsg = "Rental save changes failed";
	    		if(result.insertId) args.rental_id = result.insertId;
	    		callback(false, common.prepareResponse(errormsg, args, "Rental save changed successfully"));
			});
		});
	}
};

DB.prototype.deleteRental = function (args) {
	return function(callback){
		if(!args || !args.id) return callback(false, common.prepareResponse("Please provide rental id"));
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query(mysql.format('DELETE FROM rental WHERE rental_id = ?', [args.id]), function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "Delete rental failed";
			    return callback(false, common.prepareResponse(errormsg, (rows? rows[0]: false), "Rental deleted successfully"));
			});
		});
	}
};

DB.prototype.getInventoryListRental = function (args) {
	return function(callback){		
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query('SELECT inventory_id FROM inventory', function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no inventory.";
			    return callback(false, common.prepareResponse(errormsg, rows));
			});
		});
	}
};

DB.prototype.getCustomerListRental = function (args) {
	return function(callback){
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query('SELECT ID, first_name, last_name FROM customer_list WHERE notes="active"', function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no customer.";
			    return callback(false, common.prepareResponse(errormsg, rows));
			});
		});
	}
};

DB.prototype.getStaffListRental = function (args) {
	return function(callback){
		self.dbPool.getConnection(function(err, connection) {
			if(err || !connection) return callback(false, common.prepareResponse("Cannot connect to server"));
			connection.query('SELECT staff.staff_id, first_name, last_name FROM staff', function(err, rows) {
			    connection.release();
			    var errormsg = "";
			    if(err || !rows) errormsg = "There is no staff.";
			    return callback(false, common.prepareResponse(errormsg, rows));
			});
		});
	}
};

// DB.prototype.disconnect = function() {
// 	this.connection.end();
// };

module.exports = new DB();