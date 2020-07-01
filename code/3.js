// ## 三、结合 ES6 新语法，用简单的方式找出数组中的最小值
var arr = [12, 34, 32, 89, 4]

const findMin = array =>
	array.reduce((cur, next) => (next < cur ? next : cur), array[0])

console.log(findMin(arr))
