angular.module('chriswebApp').controller('chrisAddressCtrl',function($scope, apiService, $filter, $modal){
	//var customerListDataGrid = [];
	var copiedPreUpdateAddressList = [];
	var preCopiesList = [];
	$scope.view = {
		isLoading: true,
		addressList: [],
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
			orderby: 'address_id',
			ascdesc: false
		},
        customMsg: ''
	};
	// get data
	apiService.getAddressTotalCount({}, function(data){
		$scope.view.paging.totalItem = data.data.count;
		if($scope.view.paging.totalItem < 1) return;
		apiService.getAddressList({page: $scope.view.paging.page, limit: $scope.view.paging.limit, orderby: $scope.view.sorting.orderby, ascdesc: $scope.view.sorting.ascdesc}, function(data){
			if(data.success){
				$scope.view.addressList = data.data;
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
		apiService.getAddressList({page: $scope.view.paging.page, limit: $scope.view.paging.limit, orderby: $scope.view.sorting.orderby, ascdesc: $scope.view.sorting.ascdesc}, function(data){
			if(data.success){
				$scope.view.addressList = data.data;
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

		apiService.getAddressList({page: $scope.view.paging.page, limit: $scope.view.paging.limit, orderby: $scope.view.sorting.orderby, ascdesc: $scope.view.sorting.ascdesc}, function(data){
			if(data.success){
				$scope.view.addressList = data.data;
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

	$scope.view.loadCity = function(address){
		console.log("load city", address);
		if(address.country_id && address.country_id > 0){
			apiService.getCityList({country_id: address.country_id}, function(data){
				if(data.success){
					$scope.view.preloadedData.cityList = data.data;
				}
			});
		}
	};

	$scope.view.doEdit = function(address){
		$scope.view.loadCity(address);
		var copy = {};
		copy.addressId = address.address_id;
		copy.addressData = angular.copy(address);
		copiedPreUpdateAddressList.push(copy);
		address.isEdit = true;
	}

	$scope.view.doEditCancel = function(address) {
		angular.forEach(copiedPreUpdateAddressList, function(copiedPreUpdateAddress, index){
			if(copiedPreUpdateAddress.addressId == address.address_id) {
				angular.extend(address, copiedPreUpdateAddress.addressData);
				copiedPreUpdateAddressList.splice(index, 1);
				return false;
			}
		});
		address.isEdit = false;
	}

	$scope.view.doEditSaveChanges = function(address) {
		var newAddress = {};
		if(!address.isCopy) newAddress.address_id = address.address.address_id;
		newAddress.address = address.address;
		newAddress.district = address.district;
		newAddress.city_id = address.city_id;
		newAddress.postal_code = address.postal_code;
		newAddress.phone = address.phone;
		
		if(!newAddress.address || !newAddress.district || !newAddress.city_id || 
			!newAddress.postal_code || !newAddress.phone) {
			$scope.view.customMsg = "Please fill all information.";
			return;
		}
				
		apiService.savechangesAddress(newAddress, function(data){
			if(data.success){
				if(address.isEdit){
					angular.forEach(copiedPreUpdateAddressList, function(copiedPreUpdateAddress, index){
						if(copiedPreUpdateAddress.addressId == address.address_id) {
							copiedPreUpdateAddressList.splice(index, 1);
							return false;
						}
					});
					address.isEdit = false;
				}else if(address.isCopy){
					// copy
					angular.forEach(preCopiesList, function(preCopy, index){
						if(preCopy.addressId == address.address_id) {
							preCopiesList.splice(index, 1);
							return false;
						}
					});
					address.address_id = data.data.address_id;
					address.isCopy = false;
				}
				else if(address.isNew){
					// copy
					address.address_id = data.data.address_id;
					address.isNew = false;
				}

				angular.forEach($scope.view.preloadedData.countryList, function(country){
					if(country.country_id == address.country_id) {
						address.country = country.country;
						return false;
					}
				});

				angular.forEach($scope.view.preloadedData.cityList, function(city){
					if(city.city_id == address.city_id) {
						address.city = city.city;
						return false;
					}
				});
			}
			$scope.view.customMsg = data.msg;
		});
	}

	$scope.view.doCopy = function(address, index){
		$scope.view.loadCity(address);
		var copy = {};
		copy.addressId = address.address_id;
		preCopiesList.push(copy);
		var newAddress = angular.copy(address);
		newAddress.isCopy = true;
		$scope.view.addressList.unshift(newAddress);
	}

	$scope.view.doCopyCancel = function(address, newAddressListIndex) {
		angular.forEach(preCopiesList, function(preCopy, index){
			if(preCopy.addressId == address.address_id) {
				$scope.view.addressList.splice(newAddressListIndex, 1);
				preCopiesList.splice(index, 1);
				return false;
			}
		});
	}

	$scope.view.doAddNew = function(){
		var newAddress = {
			isNew: true,
			address_id: 0,
			address: '',
			district: '',
			city_id: 0,
			postal_code: '',
			phone: ''
		};
		$scope.view.addressList.unshift(newAddress);
	}

	$scope.view.doAddNewCancel = function(newAddressListIndex) {
		$scope.view.addressList.splice(newAddressListIndex, 1);
	}

	$scope.view.doDeleteAddress = function(indexToRemove, addressId){
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
      		apiService.deleteAddress({id: addressId}, function(data){
      			if(data.success){
      				$scope.view.addressList.splice(indexToRemove, 1)
      				//customerListDataGrid.splice(indexToRemove, 1);
      				//$scope.view.customerList = customerListDataGrid.slice($scope.view.paging.page-1, $scope.view.paging.limit);	
      			}
			});	
    	}, function () {
      		// DIMISS
    	});
	}
});

angular.module('chriswebApp').controller('chrisAddressDetailCtrl',function($scope, apiService, $state, $location, $modal){
	$scope.view = {
		isLoading: true,
		address: false,
		paging: {
            page: ($state.params.selectedItem+1),
            totalItem: 0
        }
	};
	apiService.getAnAddress({id: $state.params.addressId}, function(data){
		if(data.success){
			$scope.view.address = data;
			apiService.getAddressTotalCount({}, function(data){
				console.log(data);
				$scope.view.paging.totalItem = data.data.count;
			})
		}
		$scope.view.isLoading = false;
	});

	$scope.view.doDeleteAddress = function(){
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
      		apiService.deleteAddress({id: $state.params.addressId}, function(data){
      			if(data.success){
      				$state.transitionTo("chris-address");	
      			}
			});	
    	}, function () {
      		// DIMISS
    	});
	}

	$scope.$watch('view.paging.page', function(newVal, oldVal){
		if($scope.view.paging.page == 0 || newVal == oldVal) return;
		console.log($scope.view.paging.page);
		if($state.params.addressId > 2) return;
		apiService.getNextAddressID({id: $state.params.addressId, page: $scope.view.paging.page}, function(data){
			if(data.success && data.data.ID){
				$location.path("/address/" + data.data.ID + '/' + $scope.view.paging.page);
				//$state.transitionTo("chris-customers-detail", {customerId: data.data.ID, selectedItem: $scope.view.paging.page});
			}
		});
	});
});

angular.module('chriswebApp').controller('chrisAddressDetailAddNewCtrl',function($scope, apiService, $state, $location, $modal){
	$scope.view = {
		newAddress: {
			address_id: 0,
			address: '',
			district: '',
			city_id: 0,
			postal_code: '',
			phone: ''
		},
		preloadedData: {
			countryList: [],
			cityList: []
		},
		selectedCountry: 0,
		customMsg: ''
	};

	if($state.current.name == 'chris-address-detail-addnew-edit' || $state.current.name == 'chris-address-detail-addnew-copy'){
		apiService.getAnAddress({id: $state.params.addressId}, function(data){
			console.log(data);
			if(data.success){
				if($state.current.name == 'chris-address-detail-addnew-edit') $scope.view.newAddress.address_id = data.data.address_id;
				$scope.view.newAddress.address = data.data.address;
				$scope.view.newAddress.district = data.data.district;
				$scope.view.newAddress.city_id = data.data.city_id;
				$scope.view.selectedCountry = data.data.country_id;
				$scope.view.newAddress.postal_code = data.data.postal_code;
				$scope.view.newAddress.phone = data.data.phone;
			}
		});
	}


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

	$scope.view.SaveChanges = function(addressForm) {
		if(addressForm.$invalid) return false;
		apiService.savechangesAddress($scope.view.newAddress, function(data){
			if(data.success){
				angular.extend($scope.view.newAddress, data.data);
			}
			$scope.view.customMsg = data.msg;
		});
	};
});