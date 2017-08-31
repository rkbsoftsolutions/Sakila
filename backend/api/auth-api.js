"use strict";

var DB = require("./db"),
	crypto = require('crypto'),
	parse = require("co-body"),
	common = require("./common");

module.exports = {
	login: function (body) {
		console.log("api body",body)
		return new Promise(function (resolve, reject) {
			if (!body.email || !body.password) 	reject(common.prepareResponse("Please provide email or password"));
			var shasum = crypto.createHash('sha1')
			shasum.update(body.password);
			var userLogin = DB.login({ email: body.email, password: shasum.digest('hex') });
			userLogin(function (status, resp) {
				if (resp.success == 1) {
				resolve(resp)

				} else {
					reject(resp)
				}
			})
		})
	}
};