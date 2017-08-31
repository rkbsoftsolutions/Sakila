var common = function(){
	return {
		prepareResponse: function (err, data, successMsg) {
			var response = {
				success: 1,
				msg: (successMsg? successMsg: ''),
				data: (data? data : null)
			}
			if(err) {
				response.success = 0;
				response.msg = err;
			}
			return response;
		}
	}
}

module.exports = new common();