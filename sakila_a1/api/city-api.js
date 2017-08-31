"use strict";

var DB = require("./db"),
	parse = require("co-body");

module.exports = {
	list: function (page, limit, orderby, ascdesc) {
		return new Promise(function (resolve, reject) {
			var response = DB.getCityListData({ page: page, limit: limit, orderby: orderby, ascdesc: ascdesc });
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)
			})

		})

	},

	getCityTotalCount: function () {
		return new Promise(function (resolve, reject) {
			var response = DB.getCityTotalCount({});
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)
			})
		})
	},
	getNextCityID: function (cityId, page) {
		return new Promise(function (resolve, reject) {
			var response = DB.getNextCityID({ cityId: cityId, page: page });
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)
			})
		})
	},
	getACity: function (cityId) {
		return new Promise(function (resolve, reject) {
			var response = DB.getSingleCity({ id: cityId });
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)
			})
		})
	},
	deleteCity: function (cityId) {
		return new Promise(function (resolve, reject) {
			var response = DB.deleteCity({ id: cityId });
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)
			});
		});
	},
	saveUpdateCity: function (body) {
		return new Promise(function (resolve, reject) {
			DB.saveUpdateCity(body);
			var response = response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)
			})
		})
	}
}