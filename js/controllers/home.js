'use strict';

/** 
 * @ngdoc function
 * @name friluftsframjandetApp.controller:controller.dashboard
 * @author yianni.ververis@qlik.com
 * @description
 * # controller.dashboard
 * Controller of the myApp
 */
app.obj.angularApp
	.controller('controller.home', function ($scope, $rootScope, $location, $injector, api, utility) {
		var me = {};

		me.init = function () {
			me.measures = [
				["Count( {$<Priority={'High'}, Status -={'Closed'} >} Distinct %CaseId )", false]
			];
			me.hypercubes = {
				"mapHC": {
					"dimensions": [],
					"measures": ["SUM({<[Discharge Year]={$(=max([Discharge Year]))}>} [Total Charges])"],
					"limit": 2000
				}
				
			};
			me.listObjects = [
				["YEAR"],
				["COUNTRY"]
			];
			$scope.kapi = [];
			me.objects = ['ycppXj'];
		}
		
		me.boot = function () {
			me.init();
			
			me.events();

			me.createKpis();
			// me.getObjects();

			// me.createListObjects();

			// For debugging selections uncommment the line below
			app.obj.app.getObject('CurrentSelections', 'CurrentSelections');
			utility.log('Page loaded: ', $scope.page);
		};

		me.events = function () {
			// me.getObjects = function () {
			// 	api.destroyObjects().then(function(){
			// 		api.getObjects(me.objects);
			// 	})
			// }
			// //Alternative method for creating hypercubes
			// me.createKpis = function() {
			// 	api.getHyperCube(me.hypercubes.mapHC.dimensions, me.hypercubes.mapHC.measures, function(data){
			// 		//Function call from here
			// 	});
			// }
			$rootScope.selectInField = function (selectedVal, field) {
				var val = isNaN(Number(selectedVal)) ? selectedVal : +selectedVal;
				app.obj.app.field(field).selectValues([val], false, false)
			}

			me.createListObjects = function() {
				angular.forEach(me.listObjects, function(value, key) {
					api.createList([value[0]], function(data){
						$rootScope.listObj[value] = data;
					});
				});	
			}

			me.createKpis = function() {
				angular.forEach(me.measures, function(value, key) {
					api.getHyperCube([], [value[0]], function(data){
						$scope.kapi[key] = (value[1])?utility.string2thousands(data[0][0].qText):data[0][0].qText;
					});
				});
			}
			$rootScope.page = 1;
			$rootScope.clearAll = function () {
				app.obj.app.clearAll();
			}
			$rootScope.goTo = function(page) {
				api.destroyObjects().then(function(){
					$location.url('/' + page);
				});
			}
		}

		me.boot();
	});
