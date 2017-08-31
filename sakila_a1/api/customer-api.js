"use strict";

var DB = require("./db"),
	parse = require("co-body");

module.exports = {
	list: function (page, limit, orderby, ascdesc) {
		return new Promise(function (resolve, reject) {
			var response = DB.getCustomerList({ page: page, limit: limit, orderby: orderby, ascdesc: ascdesc });
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)

			})
		})
	}
	,
	getCustomerTotalCount: function () {
		return new Promise(function (resolve, reject) {
			var response = DB.getCustomerTotalCount({});
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)
			})
		})
	},
	getNextCustomerID: function (customerId, page) {
		return new Promise(function (resolve, reject) {
			var response = DB.getNextCustomerID({ customerId: customerId, page: page });
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)
			})
		})
	},
	getACustomer: function (customerId) {
		return new Promise(function (resolve, reject) {
			var response = DB.getSingleCustomer({ id: customerId });
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)
			})
		})
	},
	deleteCustomer: function (customerId) {
		return new Promise(function (resolve, reject) {

			var response = DB.deleteCustomer({ id: customerId });
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)
			})
		})
	},
	saveUpdateCustomer: function* () {
		var body = yield parse.json(this.req);
		this.body = yield DB.saveUpdateCustomer(body);
	},
	getStoreList: function () {
		return new Promise(function (resolve, reject) {
			var response = DB.getStoreList({});
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)

			})
		})
	},
	getCountryList: function (req, res) {
		return new Promise(function (resolve, reject) {
			var response = DB.getCountryList({});
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)


			})
		})
	},
	getCityListByCountryId: function (countryId) {
		return new Promise(function (resolve, reject) {
			var response = DB.getCityListByCountryId({ country_id: countryId });
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)
			})
		})
	}
};