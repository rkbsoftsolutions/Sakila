"use strict";

var DB = require("./db"),
	parse = require("co-body");

module.exports = {
	list: function (page, limit, orderby, ascdesc) {
		return new Promise(function (resolve, reject) {
			var response = DB.getCountryListData({ page: page, limit: limit, orderby: orderby, ascdesc: ascdesc });
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)
			})
		})
	},
	getCountryTotalCount: function () {
		return new Promise(function (resolve, reject) {
			var response = DB.getCountryTotalCount({});
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)
			})

		})
	},
	getNextCountryID: function (countryId, page) {
		return new Promise(function (resolve, reject) {
			var response = DB.getNextCountryID({ countryId: countryId, page: page });
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)
			})
		})
	},
	getACountry: function (countryId) {
		return new Promise(function (resolve, reject) {
			var response = DB.getSingleCountry({ id: countryId });
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)
			})
		});
	},
	deleteCountry: function (countryId) {
		return new Promise(function (resolve, reject) {
			var response = DB.deleteCountry({ id: countryId });
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)
			})
		})

	},
	saveUpdateCountry: function (body) {
		return new Promise(function (resolve, reject) {
			var response = DB.saveUpdateCountry(body);
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)
			})
		})
	}
};