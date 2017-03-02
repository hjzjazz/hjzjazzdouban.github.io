
var Yike = angular.module('Yike', ['ngRoute']);

// 直接运行服务
Yike.run(['$rootScope', function ($rootScope) {
	// 全局属性，用于导航栏的展示和隐藏
	$rootScope.collapsed = false;

	$rootScope.toggle = function () {
		// 更改导航状态
		$rootScope.collapsed = !$rootScope.collapsed;

		// 获取所有导航元素
		var navs = document.querySelectorAll('.navs dd');
		// 根据导航状态处理不同动画效果
		if($rootScope.collapsed) {
			// CSS 过渡时长
			// transition-duration 
			// CSS 过渡延时
			// transition-delay
			// -100%  ->  0
			for(var i=0; i<navs.length; i++) {
				// i取值 0 - 5;
				// 改变位置
				navs[i].style.transform = 'translate(0)';
				// 设置过渡时长（递增）
				navs[i].style.transitionDuration = 0.15 * (i + 1) + 's';
				// 设置延时
				navs[i].style.transitionDelay = '0.3s';
			}
		} else {
			// 0  ->  -100%

			for(var j=navs.length - 1; j>=0; j--) {
				// j的取值 5 - 0
				// 改变位置
				navs[j].style.transform = 'translate(-100%)';
				// navs.length - j
				// 6 - 5 = 1
				// 6 - 4 = 2
				// 6 - 3 = 3
				// 6 - 2 = 4
				// 6 - 1 = 5
				// 6 - 0 = 6
				// 设置过渡时长（递减）
				navs[j].style.transitionDuration = (navs.length - j) * 0.15 + 's';
				// 取消延时
				navs[j].style.transitionDelay = '';
			}
		}
	}
}]);

// 配置路由
Yike.config(['$routeProvider', function ($routeProvider) {

	// 路由必须要配置才能使用
	// 因为不同的路由需要有不同的逻辑处理
	// 比如展示不同的视图、调用不同的控制器等

	$routeProvider.when('/today', {
		// 视图模板
		templateUrl: './views/today.html',
		// 调用控制器
		controller: 'TodayCtrl'
	}).when('/older', {
		templateUrl: './views/older.html',
        controller: 'TodayCtrl'
	}).when('/author', {
		templateUrl: './views/author.html'
	}).when('/category', {
		templateUrl: './views/category.html'
	}).when('/like', {
		templateUrl: './views/like.html'
	}).when('/settings', {
		templateUrl: './views/settings.html'
	}).otherwise({
		redirectTo: '/today'
	});
}]);

// 定义一个控制器
Yike.controller('NavsCtrl', ['$scope', function ($scope) {
	// 手动拼凑数据（导航数据）
	// 将数据添加到模型而不是写死在视图上
	// 是这样做可以降低代码的耦合度

	$scope.navs = [
		{text: '今日一刻', icon: 'icon-home', link: '#/today'},
		{text: '往期内容', icon: 'icon-file-empty', link: '#/older'},
		{text: '热门作者', icon: 'icon-pencil', link: '#/author'},
		{text: '栏目浏览', icon: 'icon-menu', link: '#/category'},
		{text: '我的喜欢', icon: 'icon-heart', link: '#/like'},
		{text: '设置', icon: 'icon-cog', link: '#/settings'},
	];
}]);

// 定义控制器处理 今日一刻 
Yike.controller('TodayCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
	// 获取系统时间，并处理格式为 xxxx-xx-xx
	var today = $filter('date')(new Date(), 'yyyy-MM-dd');

	// 请求服务器数据
	$http({
		// 请求自已服务器
		// 由自已服务器代理取数据
		url: './api/today.php',
		// 传递参数
		params: {today: today}
	}).success(function (info) {
		// console.log(info);
		// 将服务器返回的数据放到模型上
		$scope.posts = info.posts;
		$scope.date = info.date;
	});
}]);