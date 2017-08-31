"use strict";

var DB = require("./db"),
	parse = require("co-body");

module.exports = {
	list: function (page, limit, orderby, ascdesc) {
		return new Promise(function (resolve, reject) {
		 var response= DB.getRentalList({page: page, limit: limit, orderby: orderby, ascdesc: ascdesc});
		  response(function (status, resp) {
			if (resp.success == 1)
				return resolve(resp)
			else
				return reject(resp)

		})
		  
		})
	},
	getRentalTotalCount: function () {
		return new Promise(function (resolve, reject) { 
			var response=	DB.getRentalTotalCount({});
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)
	
			})
		})
	},
	getNextRentalID: function *(rentalId, page) {
	  	this.body = yield DB.getNextRentalID({rentalId: rentalId, page: page});
	},
	getARental: function *(rentalId) {
	  	this.body = yield DB.getSingleRental({id: rentalId});
	},
	deleteRental: function *(rentalId) {
	  	this.body = yield DB.deleteRental({id: rentalId});
	},
	saveUpdateRental: function *(){
		var body = yield parse.json(this.req);
		this.body = yield DB.saveUpdateRental(body);
	},
	getInventoryListRental: function *() {
	  	this.body = yield DB.getInventoryListRental({});
	},
	getCustomerListRental: function *() {
	  	this.body = yield DB.getCustomerListRental({});
	},
	getStaffListRental: function *(countryId) {
	  	this.body = yield DB.getStaffListRental();
	}
};