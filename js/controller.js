(function (angular) {
	const app = angular.module('todoApp', []);
	app.controller('myController', ['$scope', '$location', 'myService', ($scope, $location, myService) => {
		$scope.tasks = myService.get();
		// enter键新建任务
		$scope.addTask = () => {
			if (!$scope.newTask) return;
			myService.add($scope.newTask);
			$scope.newTask = undefined;
		};
		// 删除任务
		$scope.delTask = (id) => {
			$scope.tasks = myService.delete(id);
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
			$scope.tasks = myService.clearAllCompleted();
		};
		let flag = true;
		// 全选设置 下面任务的选中状态与全选按钮的选中状态保持一致
		$scope.toggleAll = () => {
			$scope.tasks = myService.toggleAll(flag);
			flag = !flag;
		};
		// 监听任务变化
		$scope.$watch('tasks', (newValue) => {
			$scope.isShow = myService.getFinishNum(newValue) ? true : false;
			$scope.unfinishNum = myService.getUnfinishNum(newValue);
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
})(angular);