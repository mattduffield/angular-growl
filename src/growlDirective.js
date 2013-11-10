angular.module("angular-growl").directive("growl", ["$rootScope", function ($rootScope) {
	"use strict";

	return {
		restrict: 'A',
		template:   '<div class="growl">' +
					'	<div class="growl-item alert" ng-repeat="message in messages" ng-class="computeClasses(message)">' +
					'		<button type="button" class="close" ng-click="deleteMessage(message)">&times;</button>' +
					'            {{ message.text}}' +
					'	</div>' +
					'</div>',
		replace: false,
		scope: true,
		controller: function ($scope, $timeout) {
			$scope.messages = [];

			$rootScope.$on("growlMessage", function (event, message) {
				$scope.messages.push(message);
				if (message.ttl && message.ttl !== -1) {
					$timeout(function () {
						$scope.deleteMessage(message);
					}, message.ttl);
				}
			});

			$scope.deleteMessage = function (message) {
				var index = $scope.messages.indexOf(message);
				if (index > -1) {
					$scope.messages.splice(index, 1);
				}
				// try and execute any callback
        if (typeof(message.callback) === 'function') {
          message.callback();
        }
			};

			$scope.computeClasses = function (message) {
				return {
					'alert-success': message.isSuccess,
					'alert-error': message.isError, //bootstrap 2.3
					'alert-danger': message.isError, //bootstrap 3
					'alert-info': message.isInfo,
					'alert-warning': message.isWarn //bootstrap 3, no effect in bs 2.3
				};
			};
		}
	};
}]);
