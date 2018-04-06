(function (angular, window) {
	'use strict';

	const app = angular.module('myApp', []);
	app.controller('myController', ['$scope', '$location', ($scope, $location) => {
		// 初始化，没有一条任务
		const items = localStorage.getItem('tasks') || '[]';
		const saveLocalItems = () => {
			localStorage.setItem('tasks', JSON.stringify($scope.tasks));
		};
		$scope.tasks = JSON.parse(items);
		// 往localStorage存储
		// enter键新建任务
		$scope.addTask = () => {
			if (!$scope.newTask) return;
			$scope.tasks.push({
				completed: false,
				name: $scope.newTask,
				id: new Date().getTime()
			});
			saveLocalItems();
			$scope.newTask = undefined;
		};
		// 删除任务
		$scope.delTask = (id) => {
			for (let i = 0; i < $scope.tasks.length; i++) {
				if (id === $scope.tasks[i].id) {
					$scope.tasks.splice(i, 1);
				}
			}
			saveLocalItems();
		};
		// 编辑任务
		$scope.editTask = (id) => {
			$scope.itemId = id;
		};
		// 编辑后保存
		$scope.saveTask = () => {
			$scope.itemId = -1;
			saveLocalItems();
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
			saveLocalItems();
		};
		let flag = true;
		// 全选设置 下面任务的选中状态与全选按钮的选中状态保持一致
		$scope.toggleAll = () => {
			for (let i = 0; i < $scope.tasks.length; i++) {
				$scope.tasks[i].completed = flag;
			}
			flag = !flag;
			saveLocalItems();
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
})(angular, window);
