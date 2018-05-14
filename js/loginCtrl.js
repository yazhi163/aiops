
app.controller("loginCtrl", ['$scope', '$http','$location', '$window', 'UserService', 'AuthenticationService','$state','$rootScope',
function ($scope,$http,$location, $window, UserService, AuthenticationService,$state,$rootScope) {
   $scope.test1='银天下CMDB';
		function clearlocal() {
			AuthenticationService.isLogged = false;
			$window.localStorage.clear();
		};

		clearlocal();
        $scope.username=''
        $scope.password=''
		//User Controller (login, logout)
		$scope.logIn = function logIn(username, password) {
			$scope.err_message ="";

			if (username !== undefined && password !== undefined) {
				UserService.logIn(username, password).success(function(data) {
					AuthenticationService.isLogged = true;
					AuthenticationService.set_token(data.token);
					AuthenticationService.set_userInfo(data.username);
                                        AuthenticationService.set_emailInfo(data.email);

					$scope.err_message = "";
					//$location.path("/index");
                                       $state.go('app.dashboard-v1');
                                       //$window.location.reload();
                                       //$scope.username=$window.localStorage.user;
				}).error(function(status, data) {
                    alert(username)
					clearlocal();
					$scope.err_message = "用户名或密码错误";
					console.log(status);
					console.log(data);
				});
			}
		}

		$scope.logout = function logout() {
				clearlocal();
				//$location.path("/login");
               $state.go('login')
			}

    }]);
 app.factory('AuthenticationService', ['$window',function($window) {
    return {
        isLogged: false,

        get_userInfo: function() {
             userInfo = $window.localStorage.user;
             return userInfo;
        },

        set_userInfo: function(username){
            $window.localStorage.user = username;
        },
        set_emailInfo: function(email){
            $window.localStorage.email = email;
        },

        set_token: function(token){
            $window.localStorage.token = token;
        }
    };
}]);

app.factory('UserService', ['$http',function($http) {
    return {
        logIn: function(username, password) {
            return $http.post('/ops/auth/', {username: username, password: password});
        },

        logOut: function() {
        }
    }
}]);

app.factory('AuthInterceptor',['$rootScope', '$q', '$window', '$location', function ($rootScope, $q, $window, $location) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if($window.localStorage.token) {
                config.headers.Authorization = 'JWT ' + $window.localStorage.token;
            }
            return config;
        },
        responseError: function (response) {
            if(response.status === 401) {
                $location.path('/login');
            }
             if(response.status === 400) {
                //$location.path('/error');
            }
            return $q.reject(response);
        }
    };
}]);

app.run(function($rootScope, $location, $window, $state) {
    $rootScope.$on("$stateChangeStart", function(event, nextRoute, currentRoute) {
         if ( !$window.localStorage.token){
             $state.go('login')
             //$state.transitionTo("login", null, {notify:false});
             event.preventDefault();
             return;
         }

    });


});



//endregion



