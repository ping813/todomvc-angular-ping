(function (angular, window) {
	'use strict';

	const app = angular.module('myApp', []);
	app.controller('myController', ['$scope', '$location', 'myService', ($scope, $location, myService) => {
		$scope.tasks = myService.get();
		// 往localStorage存储
		// enter键新建任务
		$scope.addTask = () => {
			if (!$scope.newTask) return;
			myService.setTask({
				completed: false,
				name: $scope.newTask,
				id: new Date().getTime()
			});
			myService.save();
			$scope.newTask = undefined;
		};
		// 删除任务
		$scope.delTask = (id) => {
			for (let i = 0; i < $scope.tasks.length; i++) {
				if (id === $scope.tasks[i].id) {
					$scope.tasks.splice(i, 1);
				}
			}
			myService.save();
		};
		// 编辑任务
		$scope.editTask = (id) => {
			$scope.itemId = id;
		};
		// 编辑后保存
		$scope.saveTask = () => {
			$scope.itemId = -1;
			myService.save();
		}
		// 清除已完成
		$scope.clearAllFinish = () => {
			const unfinish = [];
			for (let i = 0; i < $scope.tasks.length; i++) {
				if (!$scope.tasks[i].completed) {
					unfinish.push($scope.tasks[i]);
				}
			}
			$scope.tasks = unfinish;
			myService.save();
		};
		let flag = true;
		// 全选设置 下面任务的选中状态与全选按钮的选中状态保持一致
		$scope.toggleAll = () => {
			for (let i = 0; i < $scope.tasks.length; i++) {
				$scope.tasks[i].completed = flag;
			}
			flag = !flag;
			myService.save();
		};
		// 监听任务变化
		$scope.$watch('tasks', (newValue) => {
			let finished = 0;
			for (let i = 0;i < newValue.length; i++) {
				if (newValue[i].completed) {
					finished++;
				}
			}
			if (finished) {
				// 如果有已完成的且全部已完成
				if (finished === newValue.length) {
					flag = false;
				} else {
					flag = true;
				}
			} 
			$scope.isShow = finished ? true : false;
			$scope.unfinishNum = newValue.length - finished;
			myService.save();
		}, true);
		$scope.isSelected = undefined;
		$scope.location = $location;
		// 监听地址栏变化
		$scope.$watch('location.url()', (newValue) => {
			const value = window.decodeURIComponent(newValue);
			switch (value) {
				case '#/':
				$scope.isSelected = undefined;
				break
				case '#/active':
				$scope.isSelected = false;
				break
				case '#/completed':
				$scope.isSelected = true;
				break
			}
		});
	}]);

	// 创建服务，存取于localStorage
	app.service('myService', [function () {
		const storage = window.localStorage;
		const items = JSON.parse(storage.getItem('tasks') || '[]');
		this.get = () => {
			return items;
		};
		this.save = () => {
			storage.setItem('tasks', JSON.stringify(items));
		};
		this.setTask = (tasks) => {
			items.push(tasks);
		};
	}]);
})(angular, window);
