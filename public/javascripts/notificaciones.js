var app = angular.module('app',['ngRoute','ngResource']);
 
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/todos.html',
        controller: 'NotificacionesController'
      });
  }]);

 app.factory('Notificaciones', ['$resource', function($resource){
          return $resource('/api/notificaciones/:idNotificacion', null, {
            'update': { method:'PUT' }
          });
        }]);

 
// 
// Notificaciones
 app.controller('NotificacionesController', 
 	['$scope', '$routeParams','$location', 'Notificaciones',
 		function ($scope,$routeParams, $location,Notificaciones) {


	$scope.editing = [];	 
	$scope.notificacion={};
	$scope.notificaciones = Notificaciones.query();

	$scope.types=[
					{"id": 0,value: "Mensaje"},
				  	{"id": 1,value: "Link"},
				  	{"id": 2,value: "Intra app"}]

	$scope.categories=[
					 {id: 0,value: "Informacion sobre el app",codigo:"/InfoApp"},
				     {id: 1,value: "Promociones",codigo:"/Promos"},
				     {id: 2,value: "Noticias",codigo:"/Noticias"}]			  

	$scope.inner_id=[
					 {id: 0,value: "Inbox"},
				     {id: 1,value: "Centros de Atencion"},
				     {id: 2,value: "Perfil de Usuario"},
					 {id: 3,value: "Acerca de"}]			  


	//$scope.notificacion = Notificaciones.get({idNotificacion: $routeParams.id });

	console.log("$routeParams.id",$scope.notificaciones);
	$scope.success={}

	$scope.save = function(){
		console.log("Save $scope.type",$scope.inner_id);
		/*
		$scope.notificacion.type=JSON.parse($scope.type).id;
		$scope.notificacion.category=JSON.parse($scope.category).codigo;
		$scope.notificacion.inner_id=$scope.inner_id.id;
		*/
		$scope.notificacion.type=$scope.type;
		$scope.notificacion.category=JSON.parse($scope.category);
		$scope.notificacion.inner_id=$scope.inner_id;
		
		console.log("Save notif",$scope.notificacion);
		var n = new Notificaciones($scope.notificacion);
		n.$save(function(a,b){
			console.log("a",a);
			if(a.error){
				//alert(a.error);
				$scope.error=a;
				return;
			}
		  $scope.error={};
		  $scope.notificaciones.push(a);
		  $scope.notificacion = {}; // clear textbox
		
		  $scope.success.message="Se cargo una notificacion."
  
		});

   }

/*
	


        */
    /*
	$scope.update = function(index){
		var todo = $scope.todos[index];
		Todos.update({id: todo._id}, todo, function(){
        	  	$scope.editing[index] = false;
	        });	
	}

	$scope.edit = function(index){
		$scope.editing[index] = angular.copy($scope.todos[index]);
	}

	$scope.cancel = function(index){
		$scope.todos[index] = angular.copy($scope.editing[index]);
		$scope.editing[index] = false;
	}

    	$scope.remove = function(index){
		var todo = $scope.todos[index];
            	Todos.remove({id: todo._id}, function(){
               	     $scope.todos.splice(index, 1);
           	 });
          }
*/

 
    }]);



