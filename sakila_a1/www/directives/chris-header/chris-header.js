angular.module('chriswebApp').directive('chrisHeader', ['$window', function($window) {
	return {
		restrict: 'C',
		replace: true,
		scope: {
			showBackIcon: "="
		},
		link: function(scope, element, attrs, fn) {
			scope.goBackPrevPage = function(){
				$window.history.back();
			};
		}
	};
}]);