angular.module('chriswebApp').controller('chrisLoginCtrl',function($scope, apiService, $state){
	$scope.view = {
		loginForm: {
			email: 'staronline1985@gmail.com',
			password: '12345'
		},
		error: ''
	};
	$scope.view.doLogin = function(loginForm){
		if(loginForm.$invalid) return false;
		apiService.login({email: $scope.view.loginForm.email, password: $scope.view.loginForm.password}, function(data){
			console.log(data);
			if(data && data.success){
				// redirect
				$state.transitionTo("chris-home");
			}else {
				$scope.view.error = data.msg;
			}
		})
	}
	// $scope.view.dateOptions = {
	//     formatYear: 'yy',
	//     startingDay: 1
	// };
	// $scope.view.disabledDatePicker = function(date, mode) {
	//     return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	// };

	// $scope.view.toggleMinDatePicker = function() {
	//     $scope.view.minDate = $scope.view.minDate ? null : new Date();
	// };
	// $scope.view.toggleMinDatePicker();

	// $scope.view.format = "dd/MM/yyyy";

	// $scope.view.openDatePicker = function($event) {
	// 	console.log("OPENING DATEPICKER");
	//     $event.preventDefault();
	//     $event.stopPropagation();

	//     $scope.view.opened = true;
	// };
});