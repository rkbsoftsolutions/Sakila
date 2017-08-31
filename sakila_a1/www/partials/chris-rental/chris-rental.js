angular.module('chriswebApp').controller('chrisRentalCtrl',function($scope, apiService, $filter, $modal){
	//var customerListDataGrid = [];
	var copiedPreUpdateRentalList = [];
	var preCopiesList = [];
	$scope.view = {
		isLoading: true,
		rentalList: [],
		paging: {
            page: 1,
            limit: 10,
            pagenum: 0,
            totalItem: 0
        },
        preloadedData: {
			inventoryList: [],
			customerList: [],
			staffList: []
		},
		sorting: {
			orderby: 'rental_id',
			ascdesc: false
		},
        customMsg: ''
	};
	// get data
	apiService.getRentalTotalCount({}, function(data){
		$scope.view.paging.totalItem = data.data.count;
		if($scope.view.paging.totalItem < 1) return;
		apiService.getRentalList({page: $scope.view.paging.page, limit: $scope.view.paging.limit, orderby: $scope.view.sorting.orderby, ascdesc: $scope.view.sorting.ascdesc}, function(data){
			if(data.success){
				$scope.view.rentalList = data.data;
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
		apiService.getRentalList({page: $scope.view.paging.page, limit: $scope.view.paging.limit, orderby: $scope.view.sorting.orderby, ascdesc: $scope.view.sorting.ascdesc}, function(data){
			if(data.success){
				$scope.view.rentalList = data.data;
				$scope.view.paging.pagenum = Math.ceil($scope.view.paging.totalItem/$scope.view.paging.limit);
			}
		});
	});

	$scope.view.doOrderBy = function(orderby){
		if($scope.view.sorting.orderby == orderby) $scope.view.sorting.ascdesc = !$scope.view.sorting.ascdesc;
		else $scope.view.sorting.ascdesc = false;
		$scope.view.sorting.orderby = orderby;

		apiService.getRentalList({page: $scope.view.paging.page, limit: $scope.view.paging.limit, orderby: $scope.view.sorting.orderby, ascdesc: $scope.view.sorting.ascdesc}, function(data){
			if(data.success){
				$scope.view.rentalList = data.data;
				$scope.view.paging.pagenum = Math.ceil($scope.view.paging.totalItem/$scope.view.paging.limit);
			}
		});
	}

	apiService.getInventoryListRental({}, function(data){
		if(data.success){
			$scope.view.preloadedData.inventoryList = data.data;
		}
	});

	apiService.getCustomerListRental({}, function(data){
		if(data.success){
			$scope.view.preloadedData.customerList = data.data;
		}
	});

	apiService.getStaffListRental({}, function(data){
		if(data.success){
			$scope.view.preloadedData.staffList = data.data;
		}
	});

	$scope.view.doEdit = function(rental){
		var copy = {};
		copy.rentalId = rental.rental_id;
		copy.rentalData = angular.copy(rental);
		copiedPreUpdateRentalList.push(copy);
		rental.isEdit = true;
	}

	$scope.view.doEditCancel = function(rental) {
		angular.forEach(copiedPreUpdateRentalList, function(copiedPreUpdateRental, index){
			if(copiedPreUpdateRental.rentalId == rental.rental_id) {
				angular.extend(rental, copiedPreUpdateRental.rentalData);
				copiedPreUpdateRentalList.splice(index, 1);
				return false;
			}
		});
		rental.isEdit = false;
	}

	$scope.view.doEditSaveChanges = function(rental) {
		var newRental = {};
		if(!rental.isCopy) newRental.rental_id = rental.rental_id;
		newRental.rental_date = rental.rental_date;
		newRental.inventory_id = rental.inventory_id;
		newRental.customer_id = rental.customer_id;
		newRental.return_date = rental.return_date;
		newRental.staff_id = rental.staff_id;
		
		if(!newRental.rental_date || !newRental.inventory_id || !newRental.customer_id || 
			!newRental.return_date || !newRental.staff_id) {
			$scope.view.customMsg = "Please fill all information.";
			return;
		}
				
		apiService.savechangesRental(newRental, function(data){
			if(data.success){
				if(rental.isEdit){
					angular.forEach(copiedPreUpdateRentalList, function(copiedPreUpdateRental, index){
						if(copiedPreUpdateRental.rentalId == rental.rental_id) {
							copiedPreUpdateRentalList.splice(index, 1);
							return false;
						}
					});
					rental.isEdit = false;
				}else if(rental.isCopy){
					// copy
					angular.forEach(preCopiesList, function(preCopy, index){
						if(preCopy.rentalId == rental.rental_id) {
							preCopiesList.splice(index, 1);
							return false;
						}
					});
					rental.rental_id = data.data.rental_id;
					rental.isCopy = false;
				}
				else if(rental.isNew){
					// copy
					rental.rental_id = data.data.rental_id;
					rental.isNew = false;
				}
			}
			$scope.view.customMsg = data.msg;
		});
	}

	$scope.view.doCopy = function(rental, index){
		var copy = {};
		copy.rentalId = rental.rental_id;
		preCopiesList.push(copy);
		var newRental = angular.copy(rental);
		newRental.isCopy = true;
		$scope.view.rentalList.unshift(newRental);
	}

	$scope.view.doCopyCancel = function(rental, newRentalListIndex) {
		angular.forEach(preCopiesList, function(preCopy, index){
			if(preCopy.rentalId == rental.rental_id) {
				$scope.view.rentalList.splice(newRentalListIndex, 1);
				preCopiesList.splice(index, 1);
				return false;
			}
		});
	}

	$scope.view.doAddNew = function(){
		var newRental = {
			isNew: true,
			rental_id: 0,
			rental_date: '',
			inventory_id: 0,
			customer_id: 0,
			return_date: '',
			staff_id: 0
		};
		$scope.view.rentalList.unshift(newRental);
	}

	$scope.view.doAddNewCancel = function(newRentalListIndex) {
		$scope.view.rentalList.splice(newRentalListIndex, 1);
	}

	$scope.view.doDeleteRental = function(indexToRemove, rentalId){
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
      		apiService.deleteRental({id: rentalId}, function(data){
      			if(data.success){
      				$scope.view.rentalList.splice(indexToRemove, 1)
      			}
			});	
    	}, function () {
      		// DIMISS
    	});
	}
});

angular.module('chriswebApp').controller('chrisRentalDetailCtrl',function($scope, apiService, $state, $location, $modal){
	$scope.view = {
		isLoading: true,
		rental: false,
		paging: {
            page: ($state.params.selectedItem+1),
            totalItem: 0
        }
	};
	apiService.getARental({id: $state.params.rentalId}, function(data){
		if(data.success){
			$scope.view.rental = data;
			apiService.getRentalTotalCount({}, function(data){
				console.log(data);
				$scope.view.paging.totalItem = data.data.count;
			})
		}
		$scope.view.isLoading = false;
	});

	$scope.view.doDeleteRental = function(){
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
      		apiService.deleteRental({id: $state.params.rentalId}, function(data){
      			if(data.success){
      				$state.transitionTo("chris-rental");	
      			}
			});	
    	}, function () {
      		// DIMISS
    	});
	}

	$scope.$watch('view.paging.page', function(newVal, oldVal){
		if($scope.view.paging.page == 0 || newVal == oldVal) return;
		console.log($scope.view.paging.page);
		if($state.params.rentalId > 2) return;
		apiService.getNextRentalID({id: $state.params.rentalId, page: $scope.view.paging.page}, function(data){
			if(data.success && data.data.rental_id){
				$location.path("/rental/" + data.data.rental_id + '/' + $scope.view.paging.page);
			}
		});
	});
});

angular.module('chriswebApp').controller('chrisRentalDetailAddNewCtrl',function($scope, apiService, $state, $location, $modal){
	$scope.view = {
		newRental: {
			rental_id: 0,
			rental_date: '',
			inventory_id: 0,
			customer_id: 0,
			return_date: '',
			staff_id: 0
		},
		preloadedData: {
			customerList: [],
			inventoryList: [],
			staffList: []
		},
		selectedCountry: 0,
		customMsg: ''
	};

	if($state.current.name == 'chris-rental-detail-addnew-edit' || $state.current.name == 'chris-rental-detail-addnew-copy'){
		apiService.getARental({id: $state.params.rentalId}, function(data){
			console.log(data);
			if(data.success){
				if($state.current.name == 'chris-rental-detail-addnew-edit') $scope.view.newRental.rental_id = data.data.rental_id;
				$scope.view.newRental.rental_date = data.data.rental_date;
				$scope.view.newRental.inventory_id = data.data.inventory_id;
				$scope.view.newRental.customer_id = data.data.customer_id;
				$scope.view.newRental.return_date = data.data.return_date;
				$scope.view.newRental.staff_id = data.data.staff_id;
			}
		});
	}

	apiService.getInventoryListRental({}, function(data){
		if(data.success){
			$scope.view.preloadedData.inventoryList = data.data;
		}
	});

	apiService.getCustomerListRental({}, function(data){
		if(data.success){
			$scope.view.preloadedData.customerList = data.data;
		}
	});

	apiService.getStaffListRental({}, function(data){
		if(data.success){
			$scope.view.preloadedData.staffList = data.data;
		}
	});

	$scope.view.SaveChanges = function(rentalForm) {
		if(rentalForm.$invalid) return false;
		apiService.savechangesRental($scope.view.newRental, function(data){
			if(data.success){
				angular.extend($scope.view.newRental, data.data);
			}
			$scope.view.customMsg = data.msg;
		});
	};
});