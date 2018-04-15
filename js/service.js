(function (angular) {
	const app = angular.module('myService', []);
	// 创建服务，存取于localStorage
	app.service('myService', [function () {
		const storage = window.localStorage;
		let items = JSON.parse(storage.getItem('tasks') || '[]');
		this.get = () => {
			return items;
		};
		this.save = () => {
			storage.setItem('tasks', JSON.stringify(items));
		};
		this.setTask = (tasks) => {
			items.push(tasks);
		};
		// 封装添加一条任务
		this.add = (task) => {
			this.setTask({
				completed: false,
				name: task,
				id: new Date().getTime()
			});
			this.save();
		};
		// 删除一条任务
		this.delete = (id) => {
			for (let i = 0; i < items.length; i++) {
				if (id === items[i].id) {
					items.splice(i, 1);
				}
			}
			this.save();
			return items;
		};
		// 清除已完成
		this.clearAllCompleted = () => {
			const unfinish = [];
			for (let i = 0; i < items.length; i++) {
				if (!items[i].completed) {
					unfinish.push(items[i]);
				}
			}
			items = unfinish;
			this.save();
			return items;
		};
		// 全选功能
		this.toggleAll = (flag) => {
			for (let i = 0; i < items.length; i++) {
				items[i].completed = flag;
			}
			this.save();
			return items;
		};
		// 获取未完成数目
		this.getUnfinishNum = (newValue) => {
			let unfinishedCount = 0;
			for (let i = 0;i < newValue.length; i++) {
				if (!newValue[i].completed) {
					unfinishedCount++;
				}
			}
			return unfinishedCount;
		};
		// 获取已完成数目
		this.getFinishNum = (newValue) => {
			return newValue.length - this.getUnfinishNum(newValue);
		};
	}]);

})(angular);