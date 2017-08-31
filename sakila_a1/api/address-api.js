"use strict";

var DB = require("./db"),
	parse = require("co-body");

module.exports = {
	list: function (page, limit, orderby, ascdesc) {
		return new Promise(function (resolve, reject) {
			var response=DB.getAddressList({ page: page, limit: limit,orderby: orderby, ascdesc: ascdesc })
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)

			})

		});
	},
	getAddressTotalCount: function () {
		return new Promise(function (resolve, reject) {
			var response = DB.getAddressTotalCount()
			response(function (status, resp) {
				if (resp.success == 1)
					return resolve(resp)
				else
					return reject(resp)

			})
		})
	},
	getNextAddressID: function* (addressId, page) {
		this.body = yield DB.getNextAddressID({ addressId: addressId, page: page });
	},
	getAnAddress: function* (addressId) {
		this.body = yield DB.getSingleAddress({ id: addressId });
	},
	deleteAddress: function* (addressId) {
		this.body = yield DB.deleteAddress({ id: addressId });
	},
	saveUpdateAddress: function* () {
		var body = yield parse.json(this.req);
		this.body = yield DB.saveUpdateAddress(body);
	},
};