angular.module('chriswebApp').controller('chrisCityCtrl',function($scope, apiService, $filter, $modal){
	var copiedPreUpdateCityList = [];
	var preCopiesList = [];
	$scope.view = {
		isLoading: true,
		cityList: [],
		paging: {
            page: 1,
            limit: 10,
            pagenum: 0,
            totalItem: 0
        },
        preloadedData: {
			countryList: [],
		},
		sorting: {
			orderby: 'city_id',
			ascdesc: false
		},
        customMsg: ''
	};
	// get data
	apiService.getCityTotalCount({}, function(data){
		$scope.view.paging.totalItem = data.data.count;
		if($scope.view.paging.totalItem < 1) return;
		apiService.getCityListData({page: $scope.view.paging.page, limit: $scope.view.paging.limit, orderby: $scope.view.sorting.orderby, ascdesc: $scope.view.sorting.ascdesc}, function(data){
			if(data.success){
				$scope.view.cityList = data.data;
				$scope.view.paging.pagenum = Math.ceil($scope.view.paging.totalItem/$scope.view.paging.limit);
			}
			$scope.view.isLoading = false;
		});
	});

	apiService.getCountryList({}, function(data){
		if(data.success){
			$scope.view.preloadedData.countryList = data.data;
		}
	});

	$scope.view.setPage = function (pageNo) {
	    $scope.view.paging.page = pageNo;
	};

	$scope.$watch('view.paging.page + view.paging.limit', function(){
		if($scope.view.paging.pagenum > 0 && $scope.view.paging.page > $scope.view.paging.pagenum) {
			$scope.view.paging.page = $scope.view.paging.pagenum;
			return;	
		}
		apiService.getCityListData({page: $scope.view.paging.page, limit: $scope.view.paging.limit, orderby: $scope.view.sorting.orderby, ascdesc: $scope.view.sorting.ascdesc}, function(data){
			if(data.success){
				$scope.view.cityList = data.data;
				$scope.view.paging.pagenum = Math.ceil($scope.view.paging.totalItem/$scope.view.paging.limit);
			}
		});
	});

	$scope.view.doOrderBy = function(orderby){
		if($scope.view.sorting.orderby == orderby) $scope.view.sorting.ascdesc = !$scope.view.sorting.ascdesc;
		else $scope.view.sorting.ascdesc = false;
		$scope.view.sorting.orderby = orderby;

		apiService.getCityListData({page: $scope.view.paging.page, limit: $scope.view.paging.limit, orderby: $scope.view.sorting.orderby, ascdesc: $scope.view.sorting.ascdesc}, function(data){
			if(data.success){
				$scope.view.cityList = data.data;
				$scope.view.paging.pagenum = Math.ceil($scope.view.paging.totalItem/$scope.view.paging.limit);
			}
		});
	}

	// apiService.getCountryList({}, function(data){
	// 	if(data.success){
	// 		$scope.view.preloadedData.countryList = data.data;
	// 	}
	// });

	$scope.view.doEdit = function(city){
		var copy = {};
		copy.cityId = city.city_id;
		copy.cityData = angular.copy(city);
		copiedPreUpdateCityList.push(copy);
		city.isEdit = true;
	}

	$scope.view.doEditCancel = function(city) {
		angular.forEach(copiedPreUpdateCityList, function(copiedPreUpdateCity, index){
			if(copiedPreUpdateCity.cityId == city.city_id) {
				angular.extend(city, copiedPreUpdateCity.cityData);
				copiedPreUpdateCityList.splice(index, 1);
				return false;
			}
		});
		city.isEdit = false;
	}

	$scope.view.doEditSaveChanges = function(city) {
		var newCity = {};
		if(!city.isCopy) newCity.city_id = city.city_id;
		newCity.city = city.city;
		newCity.country_id = city.country_id;

		if(!newCity.city) {
			$scope.view.customMsg = "Please fill all information.";
			return;
		}
				
		apiService.savechangesCity(newCity, function(data){
			if(data.success){
				if(city.isEdit){
					angular.forEach(copiedPreUpdateCityList, function(copiedPreUpdateCity, index){
						if(copiedPreUpdateCity.cityId == city.city_id) {
							copiedPreUpdateCityList.splice(index, 1);
							return false;
						}
					});
					city.isEdit = false;
				}else if(city.isCopy){
					// copy
					angular.forEach(preCopiesList, function(preCopy, index){
						if(preCopy.cityId == city.city_id) {
							preCopiesList.splice(index, 1);
							return false;
						}
					});
					city.city_id = data.data.city_id;
					city.isCopy = false;
				}
				else if(city.isNew){
					// copy
					city.city_id = data.data.city_id;
					city.isNew = false;
				}
				angular.forEach($scope.view.preloadedData.countryList, function(country){
					if(country.country_id == city.country_id) {
						city.country = country.country;
						return false;
					}
				});
			}
			$scope.view.customMsg = data.msg;
		});
	}

	$scope.view.doCopy = function(city, index){
		var copy = {};
		copy.cityId = city.city_id;
		preCopiesList.push(copy);
		var newCity = angular.copy(city);
		newCity.isCopy = true;
		$scope.view.cityList.unshift(newCity);
	}

	$scope.view.doCopyCancel = function(city, newCityListIndex) {
		angular.forEach(preCopiesList, function(preCopy, index){
			if(preCopy.cityId == city.city_id) {
				$scope.view.cityList.splice(newCityListIndex, 1);
				preCopiesList.splice(index, 1);
				return false;
			}
		});
	}

	$scope.view.doAddNew = function(){
		var newCity = {
			isNew: true,
			city_id: 0,
			city: '',
			country_id: 0
		};
		$scope.view.cityList.unshift(newCity);
	}

	$scope.view.doAddNewCancel = function(newCityListIndex) {
		$scope.view.cityList.splice(newCityListIndex, 1);
	}

	$scope.view.doDeleteCity = function(indexToRemove, cityId){
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
      		apiService.deleteCity({id: cityId}, function(data){
      			if(data.success){
      				$scope.view.cityList.splice(indexToRemove, 1)
      			}
			});	
    	}, function () {
      		// DIMISS
    	});
	}
});

angular.module('chriswebApp').controller('chrisCityDetailCtrl',function($scope, apiService, $state, $location, $modal){
	$scope.view = {
		isLoading: true,
		city: false,
		paging: {
            page: ($state.params.selectedItem+1),
            totalItem: 0
        },
        preloadedData: {
			countryList: [],
		}
	};
	apiService.getACity({id: $state.params.cityId}, function(data){
		if(data.success){
			$scope.view.city = data;
			apiService.getCityTotalCount({}, function(data){
				console.log(data);
				$scope.view.paging.totalItem = data.data.count;
			})
		}
		$scope.view.isLoading = false;
	});

	apiService.getCountryList({}, function(data){
		if(data.success){
			$scope.view.preloadedData.countryList = data.data;
		}
	});

	$scope.view.doDeleteCity = function(){
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
      		apiService.deleteCity({id: $state.params.cityId}, function(data){
      			if(data.success){
      				$state.transitionTo("chris-city");	
      			}
			});	
    	}, function () {
      		// DIMISS
    	});
	}

	$scope.$watch('view.paging.page', function(newVal, oldVal){
		if($scope.view.paging.page == 0 || newVal == oldVal) return;
		console.log($scope.view.paging.page);
		if($state.params.cityId > 2) return;
		apiService.getNextCityID({id: $state.params.cityId, page: $scope.view.paging.page}, function(data){
			if(data.success && data.data.ID){
				$location.path("/city/" + data.data.ID + '/' + $scope.view.paging.page);
			}
		});
	});
});

angular.module('chriswebApp').controller('chrisCityDetailAddNewCtrl',function($scope, apiService, $state, $location, $modal){
	$scope.view = {
		newCity: {
			city_id: 0,
			city: '',
			country_id: 0
		},
		preloadedData: {
			countryList: [],
		},
		customMsg: ''
	};
	apiService.getCountryList({}, function(data){
		if(data.success){
			$scope.view.preloadedData.countryList = data.data;
		}
	});

	if($state.current.name == 'chris-city-detail-addnew-edit' || $state.current.name == 'chris-city-detail-addnew-copy'){
		apiService.getACity({id: $state.params.cityId}, function(data){
			console.log(data);
			if(data.success){
				if($state.current.name == 'chris-city-detail-addnew-edit') $scope.view.newCity.city_id = data.data.city_id;
				$scope.view.newCity.city = data.data.city;
				$scope.view.newCity.country = data.data.country;
				$scope.view.newCity.country_id = data.data.country_id;
			}
		});
	}

	$scope.view.SaveChanges = function(cityForm) {
		if(cityForm.$invalid) return false;
		apiService.savechangesCity($scope.view.newCity, function(data){
			if(data.success){
				angular.extend($scope.view.newCity, data.data);
			}
			$scope.view.customMsg = data.msg;
		});
	};
});