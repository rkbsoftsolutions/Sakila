angular.module('chriswebApp').controller('chrisCountryCtrl',function($scope, apiService, $filter, $modal){
	var copiedPreUpdateCountryList = [];
	var preCopiesList = [];
	$scope.view = {
		isLoading: true,
		countryList: [],
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
			orderby: 'country_id',
			ascdesc: false
		},
        customMsg: ''
	};
	// get data
	apiService.getCountryTotalCount({}, function(data){
		$scope.view.paging.totalItem = data.data.count;
		if($scope.view.paging.totalItem < 1) return;
		apiService.getCountryListData({page: $scope.view.paging.page, limit: $scope.view.paging.limit, orderby: $scope.view.sorting.orderby, ascdesc: $scope.view.sorting.ascdesc}, function(data){
			if(data.success){
				$scope.view.countryList = data.data;
				$scope.view.paging.pagenum = Math.ceil($scope.view.paging.totalItem/$scope.view.paging.limit);
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
		apiService.getCountryListData({page: $scope.view.paging.page, limit: $scope.view.paging.limit, orderby: $scope.view.sorting.orderby, ascdesc: $scope.view.sorting.ascdesc}, function(data){
			if(data.success){
				$scope.view.countryList = data.data;
				$scope.view.paging.pagenum = Math.ceil($scope.view.paging.totalItem/$scope.view.paging.limit);
			}
		});
	});

	$scope.view.doOrderBy = function(orderby){
		if($scope.view.sorting.orderby == orderby) $scope.view.sorting.ascdesc = !$scope.view.sorting.ascdesc;
		else $scope.view.sorting.ascdesc = false;
		$scope.view.sorting.orderby = orderby;

		apiService.getCountryListData({page: $scope.view.paging.page, limit: $scope.view.paging.limit, orderby: $scope.view.sorting.orderby, ascdesc: $scope.view.sorting.ascdesc}, function(data){
			if(data.success){
				$scope.view.countryList = data.data;
				$scope.view.paging.pagenum = Math.ceil($scope.view.paging.totalItem/$scope.view.paging.limit);
			}
		});
	}

	$scope.view.doEdit = function(country){
		var copy = {};
		copy.countryId = country.country_id;
		copy.countryData = angular.copy(country);
		copiedPreUpdateCountryList.push(copy);
		country.isEdit = true;
	}

	$scope.view.doEditCancel = function(country) {
		angular.forEach(copiedPreUpdateCountryList, function(copiedPreUpdateCountry, index){
			if(copiedPreUpdateCountry.countryId == country.country_id) {
				angular.extend(country, copiedPreUpdateCountry.countryData);
				copiedPreUpdateCountryList.splice(index, 1);
				return false;
			}
		});
		country.isEdit = false;
	}

	$scope.view.doEditSaveChanges = function(country) {
		var newCountry = {};
		if(!country.isCopy) newCountry.country_id = country.country_id;
		newCountry.country = country.country;		

		if(!newCountry.country) {
			$scope.view.customMsg = "Please fill all information.";
			return;
		}
				
		apiService.savechangesCountry(newCountry, function(data){
			if(data.success){
				if(country.isEdit){
					angular.forEach(copiedPreUpdateCountryList, function(copiedPreUpdateCountry, index){
						if(copiedPreUpdateCountry.countryId == country.country_id) {
							copiedPreUpdateCountryList.splice(index, 1);
							return false;
						}
					});
					country.isEdit = false;
				}else if(country.isCopy){
					// copy
					angular.forEach(preCopiesList, function(preCopy, index){
						if(preCopy.countryId == country.country_id) {
							preCopiesList.splice(index, 1);
							return false;
						}
					});
					country.country_id = data.data.country_id;
					country.isCopy = false;
				}
				else if(country.isNew){
					// copy
					country.country_id = data.data.country_id;
					country.isNew = false;
				}
			}
			$scope.view.customMsg = data.msg;
		});
	}

	$scope.view.doCopy = function(country, index){
		var copy = {};
		copy.countryId = country.country_id;
		preCopiesList.push(copy);
		var newCountry = angular.copy(country);
		newCountry.isCopy = true;
		$scope.view.countryList.unshift(newCountry);
	}

	$scope.view.doCopyCancel = function(country, newCountryListIndex) {
		angular.forEach(preCopiesList, function(preCopy, index){
			if(preCopy.countryId == country.country_id) {
				$scope.view.countryList.splice(newCountryListIndex, 1);
				preCopiesList.splice(index, 1);
				return false;
			}
		});
	}

	$scope.view.doAddNew = function(){
		var newCountry = {
			isNew: true,
			country_id: 0,
			country: ''
		};
		$scope.view.countryList.unshift(newCountry);
	}

	$scope.view.doAddNewCancel = function(newCountryListIndex) {
		$scope.view.countryList.splice(newCountryListIndex, 1);
	}

	$scope.view.doDeleteCountry = function(indexToRemove, countryId){
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
      		apiService.deleteCountry({id: countryId}, function(data){
      			if(data.success){
      				$scope.view.countryList.splice(indexToRemove, 1)
      			}
			});	
    	}, function () {
      		// DIMISS
    	});
	}
});

angular.module('chriswebApp').controller('chrisCountryDetailCtrl',function($scope, apiService, $state, $location, $modal){
	$scope.view = {
		isLoading: true,
		country: false,
		paging: {
            page: ($state.params.selectedItem+1),
            totalItem: 0
        }
	};
	apiService.getACountry({id: $state.params.countryId}, function(data){
		if(data.success){
			$scope.view.country = data;
			apiService.getCountryTotalCount({}, function(data){
				console.log(data);
				$scope.view.paging.totalItem = data.data.count;
			})
		}
		$scope.view.isLoading = false;
	});

	$scope.view.doDeleteCountry = function(){
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
      		apiService.deleteCountry({id: $state.params.countryId}, function(data){
      			if(data.success){
      				$state.transitionTo("chris-country");	
      			}
			});	
    	}, function () {
      		// DIMISS
    	});
	}

	$scope.$watch('view.paging.page', function(newVal, oldVal){
		if($scope.view.paging.page == 0 || newVal == oldVal) return;
		console.log($scope.view.paging.page);
		if($state.params.countryId > 2) return;
		apiService.getNextCountryID({id: $state.params.countryId, page: $scope.view.paging.page}, function(data){
			if(data.success && data.data.ID){
				$location.path("/country/" + data.data.ID + '/' + $scope.view.paging.page);
			}
		});
	});
});

angular.module('chriswebApp').controller('chrisCountryDetailAddNewCtrl',function($scope, apiService, $state, $location, $modal){
	$scope.view = {
		newCountry: {
			country_id: 0,
			country: ''
		},
		customMsg: ''
	};

	if($state.current.name == 'chris-country-detail-addnew-edit' || $state.current.name == 'chris-country-detail-addnew-copy'){
		apiService.getACountry({id: $state.params.countryId}, function(data){
			console.log(data);
			if(data.success){
				if($state.current.name == 'chris-country-detail-addnew-edit') $scope.view.newCountry.country_id = data.data.country_id;
				$scope.view.newCountry.country = data.data.country;
			}
		});
	}

	$scope.view.SaveChanges = function(countryForm) {
		if(countryForm.$invalid) return false;
		apiService.savechangesCountry($scope.view.newCountry, function(data){
			if(data.success){
				angular.extend($scope.view.newCountry, data.data);
			}
			$scope.view.customMsg = data.msg;
		});
	};
});