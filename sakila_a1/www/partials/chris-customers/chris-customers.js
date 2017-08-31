angular.module('chriswebApp').controller('chrisCustomerCtrl',function($scope, apiService, $filter, $modal){
	//var customerListDataGrid = [];
	var copiedPreUpdateCustomerList = [];
	var preCopiesList = [];
	$scope.view = {
		isLoading: true,
		customerList: [],
		paging: {
            page: 1,
            limit: 10,
            pagenum: 0,
            totalItem: 0
        },
        preloadedData: {
			storeList: [],
			countryList: [],
			cityList: []
		},
		sorting: {
			orderby: 'ID',
			ascdesc: false
		},
        customMsg: ''
	};
	// get data
	apiService.getCustomerTotalCount({}, function(data){
		$scope.view.paging.totalItem = data.data.count;
		if($scope.view.paging.totalItem < 1) return;
		apiService.getCustomerList({page: $scope.view.paging.page, limit: $scope.view.paging.limit, orderby: $scope.view.sorting.orderby, ascdesc: $scope.view.sorting.ascdesc}, function(data){
			if(data.success){
				$scope.view.customerList = data.data;
				// customerListDataGrid = data.data;
				// $scope.view.customerList = customerListDataGrid.slice($scope.view.paging.page-1, $scope.view.paging.limit);
				$scope.view.paging.pagenum = Math.ceil($scope.view.paging.totalItem/$scope.view.paging.limit);
				//$scope.view.paging.totalItem = customerListDataGrid.length;
			}
			$scope.view.isLoading = false;
		});
	});

	$scope.view.setPage = function (pageNo) {
	    $scope.view.paging.page = pageNo;
	};

	$scope.$watch('view.paging.page + view.paging.limit', function(){
		if($scope.view.paging.pagenum > 0 && $scope.view.paging.page > $scope.view.paging.pagenum) {
			$scope.view.paging.page = $scope.view.paging.pagenum;
			return;	
		}
		apiService.getCustomerList({page: $scope.view.paging.page, limit: $scope.view.paging.limit, orderby: $scope.view.sorting.orderby, ascdesc: $scope.view.sorting.ascdesc}, function(data){
			if(data.success){
				$scope.view.customerList = data.data;
				//customerListDataGrid = data.data;
				//$scope.view.customerList = customerListDataGrid.slice($scope.view.paging.page-1, $scope.view.paging.limit);
				$scope.view.paging.pagenum = Math.ceil($scope.view.paging.totalItem/$scope.view.paging.limit);
				//$scope.view.paging.totalItem = customerListDataGrid.length;
			}
			//$scope.view.isLoading = false;
		});
		//$scope.view.customerList = customerListDataGrid.slice(($scope.view.paging.page*$scope.view.paging.limit)-$scope.view.paging.limit, $scope.view.paging.page*$scope.view.paging.limit);
	});

	$scope.view.doOrderBy = function(orderby){
		if($scope.view.sorting.orderby == orderby) $scope.view.sorting.ascdesc = !$scope.view.sorting.ascdesc;
		else $scope.view.sorting.ascdesc = false;
		$scope.view.sorting.orderby = orderby;

		apiService.getCustomerList({page: $scope.view.paging.page, limit: $scope.view.paging.limit, orderby: $scope.view.sorting.orderby, ascdesc: $scope.view.sorting.ascdesc}, function(data){
			if(data.success){
				$scope.view.customerList = data.data;
				//customerListDataGrid = data.data;
				//$scope.view.customerList = customerListDataGrid.slice($scope.view.paging.page-1, $scope.view.paging.limit);
				$scope.view.paging.pagenum = Math.ceil($scope.view.paging.totalItem/$scope.view.paging.limit);
				//$scope.view.paging.totalItem = customerListDataGrid.length;
			}
			//$scope.view.isLoading = false;
		});
	}

	apiService.getStoreList({}, function(data){
		if(data.success){
			$scope.view.preloadedData.storeList = data.data;
		}
	});

	apiService.getCountryList({}, function(data){
		if(data.success){
			$scope.view.preloadedData.countryList = data.data;
		}
	});

	$scope.view.loadCity = function(customer){
		console.log("load city", customer);
		if(customer.country_id && customer.country_id > 0){
			apiService.getCityList({country_id: customer.country_id}, function(data){
				if(data.success){
					$scope.view.preloadedData.cityList = data.data;
				}
			});
		}
	};

	$scope.view.doEdit = function(customer){
		$scope.view.loadCity(customer);
		var copy = {};
		copy.customerId = customer.ID;
		copy.customerData = angular.copy(customer);
		copiedPreUpdateCustomerList.push(copy);
		customer.isEdit = true;
	}

	$scope.view.doEditCancel = function(customer) {
		angular.forEach(copiedPreUpdateCustomerList, function(copiedPreUpdateCustomer, index){
			if(copiedPreUpdateCustomer.customerId == customer.ID) {
				angular.extend(customer, copiedPreUpdateCustomer.customerData);
				copiedPreUpdateCustomerList.splice(index, 1);
				return false;
			}
		});
		customer.isEdit = false;
	}

	$scope.view.doEditSaveChanges = function(customer) {
		var newCustomer = {};
		if(!customer.isCopy) newCustomer.customer_id = customer.ID;
		newCustomer.first_name = customer.first_name;
		newCustomer.last_name = customer.last_name;
		newCustomer.store_id = customer.SID;
		newCustomer.email = customer.email;
		newCustomer.country_id = customer.country_id;
		newCustomer.city_id = customer.city_id;
		newCustomer.postal_code = customer.zipcode;
		newCustomer.district = customer.district;
		newCustomer.address = customer.address;
		newCustomer.phone = customer.phone;
		newCustomer.active = customer.active;
		newCustomer.notes = customer.notes;

		if(!newCustomer.first_name || !newCustomer.last_name || !newCustomer.store_id || 
			!newCustomer.email || !newCustomer.country_id || !newCustomer.city_id || 
			!newCustomer.postal_code || !newCustomer.district || !newCustomer.address ||
			!newCustomer.phone || !newCustomer.notes) {
			$scope.view.customMsg = "Please fill all information.";
			return;
		}
				
		apiService.savechangesCustomer(newCustomer, function(data){
			if(data.success){
				if(customer.isEdit){
					angular.forEach(copiedPreUpdateCustomerList, function(copiedPreUpdateCustomer, index){
						if(copiedPreUpdateCustomer.customerId == customer.ID) {
							copiedPreUpdateCustomerList.splice(index, 1);
							return false;
						}
					});
					customer.isEdit = false;
				}else if(customer.isCopy){
					// copy
					angular.forEach(preCopiesList, function(preCopy, index){
						if(preCopy.customerId == customer.ID) {
							preCopiesList.splice(index, 1);
							return false;
						}
					});
					customer.ID = data.data.customer_id;
					customer.isCopy = false;
				}
				else if(customer.isNew){
					// copy
					customer.ID = data.data.customer_id;
					customer.isNew = false;
				}
			}
			$scope.view.customMsg = data.msg;
		});
	}

	$scope.view.doCopy = function(customer, index){
		$scope.view.loadCity(customer);
		var copy = {};
		copy.customerId = customer.ID;
		preCopiesList.push(copy);
		var newCustomer = angular.copy(customer);
		newCustomer.isCopy = true;
		$scope.view.customerList.unshift(newCustomer);
	}

	$scope.view.doCopyCancel = function(customer, newCustomerListIndex) {
		angular.forEach(preCopiesList, function(preCopy, index){
			if(preCopy.customerId == customer.ID) {
				$scope.view.customerList.splice(newCustomerListIndex, 1);
				preCopiesList.splice(index, 1);
				return false;
			}
		});
	}

	$scope.view.doAddNew = function(){
		var newCustomer = {
			isNew: true,
			ID: 0,
			first_name: '',
			last_name: '',
			email: '',
			address: '',
			zipcode: '',
			phone: '',
			district: '',
			country: '',
			country_id: 0,
			city: '',
			city_id: 0,
			notes: '',
			SID: 0,
			active: 1
		};
		$scope.view.customerList.unshift(newCustomer);
	}

	$scope.view.doAddNewCancel = function(newCustomerListIndex) {
		$scope.view.customerList.splice(newCustomerListIndex, 1);
	}

	$scope.view.doDeleteCustomer = function(indexToRemove, customerId){
		var modalInstance = $modal.open({
      		templateUrl: 'deleteConfirmationDialog.html',
      		controller: function($scope, $modalInstance){
      			$scope.ok = function () {
				    $modalInstance.close();
				};

				$scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				};
      		}
    	});
		modalInstance.result.then(function (selectedItem) {
      		apiService.deleteCustomer({id: customerId}, function(data){
      			if(data.success){
      				$scope.view.customerList.splice(indexToRemove, 1)
      				//customerListDataGrid.splice(indexToRemove, 1);
      				//$scope.view.customerList = customerListDataGrid.slice($scope.view.paging.page-1, $scope.view.paging.limit);	
      			}
			});	
    	}, function () {
      		// DIMISS
    	});
	}
});

angular.module('chriswebApp').controller('chrisCustomerDetailCtrl',function($scope, apiService, $state, $location, $modal){
	$scope.view = {
		isLoading: true,
		customer: false,
		paging: {
            page: ($state.params.selectedItem+1),
            totalItem: 0
        }
	};
	apiService.getACustomer({id: $state.params.customerId}, function(data){
		if(data.success){
			$scope.view.customer = data;
			apiService.getCustomerTotalCount({}, function(data){
				console.log(data);
				$scope.view.paging.totalItem = data.data.count;
			})
		}
		$scope.view.isLoading = false;
	});

	$scope.view.doDeleteCustomer = function(){
		var modalInstance = $modal.open({
      		templateUrl: 'deleteConfirmationDialog.html',
      		controller: function($scope, $modalInstance){
      			$scope.ok = function () {
				    $modalInstance.close();
				};

				$scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				};
      		}
    	});
		modalInstance.result.then(function (selectedItem) {
      		// ok
      		console.log("REMOVE NOW!");
      		apiService.deleteCustomer({id: $state.params.customerId}, function(data){
      			if(data.success){
      				$state.transitionTo("chris-customers");	
      			}
			});	
    	}, function () {
      		// DIMISS
    	});
	}

	$scope.$watch('view.paging.page', function(newVal, oldVal){
		if($scope.view.paging.page == 0 || newVal == oldVal) return;
		console.log($scope.view.paging.page);
		if($state.params.customerId > 2) return;
		apiService.getNextCustomerID({id: $state.params.customerId, page: $scope.view.paging.page}, function(data){
			if(data.success && data.data.ID){
				$location.path("/customers/" + data.data.ID + '/' + $scope.view.paging.page);
				//$state.transitionTo("chris-customers-detail", {customerId: data.data.ID, selectedItem: $scope.view.paging.page});
			}
		});
	});
});

angular.module('chriswebApp').controller('chrisCustomerDetailAddNewCtrl',function($scope, apiService, $state, $location, $modal){
	$scope.view = {
		newCustomer: {
			customer_id: 0,
			store_id: 0,
			first_name: '',
			last_name: '',
			email: '',
			city_id: 0,
			postal_code: '',
			district: '',
			address: '',
			phone: '',
			active: 1
		},
		preloadedData: {
			storeList: [],
			countryList: [],
			cityList: []
		},
		selectedCountry: 0,
		customMsg: ''
	};

	if($state.current.name == 'chris-customers-detail-addnew-edit' || $state.current.name == 'chris-customers-detail-addnew-copy'){
		apiService.getACustomer({id: $state.params.customerId}, function(data){
			console.log(data);
			if(data.success){
				if($state.current.name == 'chris-customers-detail-addnew-edit') $scope.view.newCustomer.customer_id = data.data.ID;
				$scope.view.newCustomer.store_id = data.data.SID;
				$scope.view.newCustomer.first_name = data.data.first_name;
				$scope.view.newCustomer.last_name = data.data.last_name;
				$scope.view.newCustomer.email = data.data.email;
				$scope.view.selectedCountry = data.data.country_id;
				$scope.view.newCustomer.city_id = data.data.city_id;
				$scope.view.newCustomer.postal_code = data.data.zipcode;
				$scope.view.newCustomer.district = data.data.district;
				$scope.view.newCustomer.address = data.data.address;
				$scope.view.newCustomer.phone = data.data.phone;
				$scope.view.newCustomer.active = data.data.active;
			}
		});
	}

	apiService.getStoreList({}, function(data){
		if(data.success){
			$scope.view.preloadedData.storeList = data.data;
		}
	});

	apiService.getCountryList({}, function(data){
		if(data.success){
			$scope.view.preloadedData.countryList = data.data;
			console.log($scope.view.selectedCountry);
		}
	});

	$scope.$watch('view.selectedCountry', function(){
		if($scope.view.selectedCountry && $scope.view.selectedCountry > 0){
			apiService.getCityList({country_id: $scope.view.selectedCountry}, function(data){
				if(data.success){
					$scope.view.preloadedData.cityList = data.data;
				}
			});
		}
	});

	$scope.view.SaveChanges = function(customerForm) {
		if(customerForm.$invalid) return false;
		apiService.savechangesCustomer($scope.view.newCustomer, function(data){
			if(data.success){
				angular.extend($scope.view.newCustomer, data.data);
			}
			$scope.view.customMsg = data.msg;
		});
	};
});