angular.module('chriswebApp').factory('apiService', function($http) {
  return {
  	login: function(args, callback){
  		//data, status, headers, config
  		$http.post('/api/login', args)
  		.success(callback)
  		.error(callback);
  	},
  	getCustomerList: function(args, callback){
      if(args.ascdesc) args.ascdesc = 1; else args.ascdesc = 0;
  		$http.get('/api/customers/' + args.page + '/' + args.limit + '/' + args.orderby + '/' + args.ascdesc)
  		.success(callback)
  		.error(callback);
  	},
  	getCustomerTotalCount: function(args, callback){
  		$http.get('/api/customers/count')
  		.success(callback)
  		.error(callback);
  	},
  	getNextCustomerID: function(args, callback){
  		$http.get('/api/customers/next/' + args.id + "/" + args.page)
  		.success(callback)
  		.error(callback);
  	},
  	getACustomer: function(args, callback){
  		$http.get('/api/customers/' + args.id)
  		.success(callback)
  		.error(callback);
  	},
  	deleteCustomer: function(args, callback){
  		$http.post('/api/customers/delete/' + args.id, {})
  		.success(callback)
  		.error(callback);
  	},
    savechangesCustomer: function(args, callback){
      $http.post('/api/customers/savechanges', args)
      .success(callback)
      .error(callback);
    },
    getStoreList: function(args, callback){
      $http.get('/api/customers/loadstores')
      .success(callback)
      .error(callback);
    },
    getCountryList: function(args, callback){
      $http.get('/api/customers/loadcountries')
      .success(callback)
      .error(callback);
    },
    getCityList: function(args, callback){
      $http.get('/api/customers/loadcities/' + args.country_id)
      .success(callback)
      .error(callback);
    },
    getCountryListData: function(args, callback){
      if(args.ascdesc) args.ascdesc = 1; else args.ascdesc = 0;
      $http.get('/api/country/' + args.page + '/' + args.limit + '/' + args.orderby + '/' + args.ascdesc)
      .success(callback)
      .error(callback);
    },
    getCountryTotalCount: function(args, callback){
      $http.get('/api/country/count')
      .success(callback)
      .error(callback);
    },
    getNextCountryID: function(args, callback){
      $http.get('/api/country/next/' + args.id + "/" + args.page)
      .success(callback)
      .error(callback);
    },
    getACountry: function(args, callback){
      $http.get('/api/country/' + args.id)
      .success(callback)
      .error(callback);
    },
    deleteCountry: function(args, callback){
      $http.post('/api/country/delete/' + args.id, {})
      .success(callback)
      .error(callback);
    },
    savechangesCountry: function(args, callback){
      $http.post('/api/country/savechanges', args)
      .success(callback)
      .error(callback);
    },
    getCityListData: function(args, callback){
      if(args.ascdesc) args.ascdesc = 1; else args.ascdesc = 0;
      $http.get('/api/city/' + args.page + '/' + args.limit + '/' + args.orderby + '/' + args.ascdesc)
      .success(callback)
      .error(callback);
    },
    getCityTotalCount: function(args, callback){
      $http.get('/api/city/count')
      .success(callback)
      .error(callback);
    },
    getNextCityID: function(args, callback){
      $http.get('/api/city/next/' + args.id + "/" + args.page)
      .success(callback)
      .error(callback);
    },
    getACity: function(args, callback){
      $http.get('/api/city/' + args.id)
      .success(callback)
      .error(callback);
    },
    deleteCity: function(args, callback){
      $http.post('/api/city/delete/' + args.id, {})
      .success(callback)
      .error(callback);
    },
    savechangesCity: function(args, callback){
      $http.post('/api/city/savechanges', args)
      .success(callback)
      .error(callback);
    },

    getAddressList: function(args, callback){
      if(args.ascdesc) args.ascdesc = 1; else args.ascdesc = 0;
      $http.get('/api/address/' + args.page + '/' + args.limit + '/' + args.orderby + '/' + args.ascdesc)
      .success(callback)
      .error(callback);
    },
    getAddressTotalCount: function(args, callback){
      $http.get('/api/address/count')
      .success(callback)
      .error(callback);
    },
    getNextAddressID: function(args, callback){
      $http.get('/api/address/next/' + args.id + "/" + args.page)
      .success(callback)
      .error(callback);
    },
    getAnAddress: function(args, callback){
      $http.get('/api/address/' + args.id)
      .success(callback)
      .error(callback);
    },
    deleteAddress: function(args, callback){
      $http.post('/api/address/delete/' + args.id, {})
      .success(callback)
      .error(callback);
    },
    savechangesAddress: function(args, callback){
      $http.post('/api/address/savechanges', args)
      .success(callback)
      .error(callback);
    },
    getRentalList: function(args, callback){
      if(args.ascdesc) args.ascdesc = 1; else args.ascdesc = 0;
      $http.get('/api/rental/' + args.page + '/' + args.limit + '/' + args.orderby + '/' + args.ascdesc)
      .success(callback)
      .error(callback);
    },
    getRentalTotalCount: function(args, callback){
      $http.get('/api/rental/count')
      .success(callback)
      .error(callback);
    },
    getNextRentalID: function(args, callback){
      $http.get('/api/rental/next/' + args.id + "/" + args.page)
      .success(callback)
      .error(callback);
    },
    getARental: function(args, callback){
      $http.get('/api/rental/' + args.id)
      .success(callback)
      .error(callback);
    },
    deleteRental: function(args, callback){
      $http.post('/api/rental/delete/' + args.id, {})
      .success(callback)
      .error(callback);
    },
    savechangesRental: function(args, callback){
      $http.post('/api/rental/savechanges', args)
      .success(callback)
      .error(callback);
    },
    getInventoryListRental: function(args, callback){
      $http.get('/api/rental/loadinventory')
      .success(callback)
      .error(callback);
    },
    getCustomerListRental: function(args, callback){
      $http.get('/api/rental/loadcustomer')
      .success(callback)
      .error(callback);
    },
    getStaffListRental: function(args, callback){
      $http.get('/api/rental/loadstaff')
      .success(callback)
      .error(callback);
    }
  };
});