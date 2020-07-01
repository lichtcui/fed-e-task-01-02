# JavaScript 性能优化
- 提高运行效率
- 降低运行开销

## 内存管理 Memory Management
- 内存： 由可读写单元组成，表示一片可操作空间
- 管理： 人为的去操作一片空间的申请、使用和释放
- 内存管理： 开发者主动申请空间、使用空间、释放空间
- 管理流程： 申请-使用-释放
```
// 内存泄漏
const fn = () => {
	arrList = []
	arrList[100000] = "lg is a coder"
}
fn()

// 申请空间
let obj = {}
// 使用空间
obj.name = "lg"
// 释放空间
obj = null
```

## 垃圾回收
- JS 中内存管理是自动的
- 对象不再被引用时是垃圾
- 对象不能从根上访问到时是垃圾

可达对象
- 可以访问到的对象就是可达对象（引用、作用域链）
- 可达的标准就是从根出发是否能够被找到
- JS 中的根就可以理解为时全局变量对象
```
// reference
// 被obj对象引用了
// 可从根上找到，可达
let obj = { name: "xm" }

// xm空间又多了次引用，引用数值变化
let ali = obj

// xm空间引用被断，因为ali还在引用xm，所以xm还是可达
obj = null

function objGroup(obj1, obj2) {
	obj1.next = obj2
	obj2.prev = obj1

	return {
		o1: obj1,
		o2: obj2,
	}
}

let obj = objGroup({ name: "obj1" }, { name: "obj2" })
console.log(obj)
```

## GC 算法
GC 就是垃圾回收机制的简写，可以找到内存中的垃圾、并释放和回收空间

GC 里的垃圾是什么
- 程序中不再需要使用的对象
	```
	// 当函数调用完成后，已经不需要name了，name 可以被当作垃圾
	function func() {
		name = "lg"
		return `${name} is a coder`
	}
	func()
	```
- 程序中不能再访问到的对象
	```
	// 当函数调用完成后，在外部空间不能访问到name，找不到的时候可以当作垃圾
	function func() {
		const name = "lg"
		return `${name} is a coder`
	}
	func()
	```

GC 算法是什么
- 是一种机制，垃圾回收器完成具体的工作
- 工作的内容就是查找垃圾释放空间、回收空间
- 算法就是工作时查找和回收所遵循的规则

常见GC算法
- 引用计数
- 标记清除
- 标记整理
- 分代回收

### 引用计数算法
内部用引用计数器来维护每个对象存在的引用数值，通过值是否为0来判断是否为垃圾对象，从而让垃圾回收器对当前空间进行回收和释放

- 核心思想：设置引用数，判断当前引用数是否为0
- 引用计数器
- 引用关系改变时修改引用数字
- 引用数字为0时立即回收

优点
- 即时回收垃圾对象
- 减少程序卡顿时间
缺点
- 无法回收循环引用的对象
- 资源消耗较大

```
// window 对象下
const user1 = { age: 11 }
const user2 = { age: 12 }
const user3 = { age: 13 }

// user1-3 始终在被引用，无法被回收
const nameList = [user1.age, user2.age, user3.age]

const fn = () => {
	// window 对象下
	// num1 = 1
	// num2 = 2

	// 作用域内起效果，当函数调用后在外部就找不到num1&2
	// 他们的引用计数会变成0，gc开始工作，将他们当成垃圾进行对象回收
	const num1 = 1
	const num2 = 2
}
fn()

const fn = () => {
	const obj1 = {}
	const obj2 = {}

	// 全局找不到obj1&2，但是又互相指引关系，身上的引用计数器并不为0
	// GC无法回收，造成空间浪费
	obj1.name = obj2
	obj2.name = obj1

	return ""
}
fn()
```

### 标记清除算法
遍历所有对象，给活动对象进行标记，把没有标记对象清除，从而释放垃圾对象所占用的空间

- 核心思想：分标记和清除二个阶段完成
- 遍历所有对象找标记活动对象
- 遍历所有对象清除没有标记对象
- 回收相应空间

优点
- 可以回收循环引用的对象
缺点
- 容易产生碎片化空间，浪费空间
- 不能立即回收垃圾对象

### 标记整理算法
和标记清除相似，但在清除前会整理当前地址空间
- 可以看做是标记清除的增强
- 标记阶段的操作和标记清除一致
- 清除阶段会先执行整理，移动对象位置

优点
- 减少碎片化空间
缺点
- 不会立即回收垃圾对象

## V8 引擎
- 主流的JavaScript执行引擎
- 采用即时编译
- 内存设限（64位不超过1.5G 32位不超过800M）
- 采用分代回收的思想，内存分为新生代、老生代
- V8垃圾回收常见的GC算法
	- 分代回收
	- 空间复制
	- 标记清除
	- 标记整理
	- 标记增量

### V8 内存分配
- V8 内存空间一分为二
- 新生代
	- 存储于左侧小空间（32M｜16M）
	- 新生代指的是存活时间较短的对象
- 老生代
	- 存储于右侧（1.4G｜700M）
	- 新生代指的是存活时间较长的对象（全局存放的一些变量，闭包存放的变量）
对比
	- 新生代区域垃圾回收 使用空间换时间
	- 老生代区域垃圾回收不适合复制算法

### 新生代对象回收
- 回收过程采用复制算法+标记整理
- 新生代内存区分为二个等大小空间
- 使用空间为From，空闲空间为To
- 活动对象存储于From空间
- 标记整理后将活动对象拷贝至To
- From 与 To 交换空间完成释放

说明
- 拷贝过程中可能出现晋升
- 晋升就是讲新生代对象移至老生代
- 一轮GC 还存活的新生代需要晋升
- To 空间的使用率超过25%

### 老生代对象回收
- 主要采用标记清除、标记整理、增量标记算法
- 首先使用标记清除完成垃圾空间的回收
- 采用标记整理进行空间优化（新生代晋升老生代，而且老生代存储空间不足）
- 采用增量标记进行效率优化

## Performance 工具
### 为什么使用
- GC 的目的是为了实现内存空间的良性循环
- 良性循环的基石是合理使用
- 时刻关注才能确定是否合理
- performance 提供多种监控方式，时刻监控内存

### 使用步骤
- 打开浏览器输入目标网址
- 进入开发人员工具面板，选择性能
- 开启录制功能，访问具体界面
- 执行用户行为，一段时间后停止录制
- 分析界面中记录的内存信息

### 内存问题的体现
- 内存泄漏：内存使用持续升高（页面出现延迟加载或经常性暂停）
- 内存膨胀：在多数设备上都存在性能问题（页面持续性出现糟糕的性能）
- 频繁垃圾回收：通过内存变化图进行分析（页面的性能随时间延长越来越差）

### 监控内存的几种方式
- 浏览器任务管理器
	```
	More Tools -> Task Manager
	内存：原生内存，DOM节点所占据的内存（不断增大，说明不断在添加新DOM）
	JS内存：JS的堆，需要关注的是小括号里的值，表示界面当中所有可达对象正在使用的内存大小（不断增大，说明在不断创建新对象/现有对象不断的在增长）
	```

- Timeline 时序图记录
- 堆快照查找分离 DOM
	- 分离DOM
		界面元素存活在DOM树上
		垃圾对象的DOM节点
		分离状态的DOM节点
		利用浏览器的堆快照Heap snapshot，把当前堆进行拍照，查找当前堆中是否存在分离dom，在界面中不体现，但在内存中存在（浪费内存），定位到代码中分离dom的位置，想办法清除
		```
		var tmpEle
		const fn = () => {
			var ul = document.createElement("ul")
			for (var i = 0; i < 10; i++) {
				var li = document.createElement("li")
				ul.appendChild(li)
			}
			tmpEle = ul
			// 后续不需要使用，清空
			tmpEle = null
		}
		```
- 判断是否存在频繁的垃圾回收
	GC工作时应用程序是停止的
	频繁且过长的GC会导致应用假死
	用户使用中感知应用卡顿

	确定频繁的垃圾回收
	- Timeline中频繁的上升下降
	- 任务管理器中数据频繁的增加减少

## 如何精准测试js性能
本质上就是采集大量的执行样本进行数学统计和分析
使用基于Benchmark.js的https://jsperf.com完成

	jsperf使用流程
		填写测试用例信息（title、slug）
		填写准备代码（Dom操作室经常食用）


## 慎用全局变量
- 全局变量定义在全局执行上下文，是所有作用域链的顶端
- 全局执行上下文一致存在于上下文执行栈，直到程序退出
- 如果某个局部作用域出现了同名变量则会遮蔽或污染全局
```
// 95% slower
var i,
	str = ""
for (i = 0; i < 1000; i++) {
	str += i
}

// fastest
for (let i = 0; i < 1000; i++) {
	let str = ""
	str += i
}
```

## 缓存全局变量
将使用中无法避免的全局变量缓存到局部
```
// 0.73% slower
function getBtn() {
	let oBtn1 = document.getElementById("btn1")
	let oBtn3 = document.getElementById("btn3")
	let oBtn5 = document.getElementById("btn5")
	let oBtn7 = document.getElementById("btn7")
	let oBtn9 = document.getElementById("btn9")
}
// faster
function getBtn2() {
	let obj = document
	let oBtn1 = obj.getElementById("btn1")
	let oBtn3 = obj.getElementById("btn3")
	let oBtn5 = obj.getElementById("btn5")
	let oBtn7 = obj.getElementById("btn7")
	let oBtn9 = obj.getElementById("btn9")
}
```

## 通过原型新增方法
在原型对象上新增实例对象需要的方法
```
// 18% slower
var fn1 = function () {
	this.foo = function () {
		console.log(11111)
	}
}
f1 = new fn1()

// 2% slower
var fn2 = function () {}
fn2.prototype.foo = function () {
	console.log(11111)
}
f2 = new fn2()

// fastest
const fn3 = function() {}
fn3.prototype.foo = () => console.log(11111)
const f3 = new fn3()
```

## 避开闭包陷阱
闭包特点
外部具有指向内部的引用
在外部作用域访问内部作用域的数据
```
function foo() {
	var name = 'lg'
	function fn() {
		console.log(name)
	}
	return fn
}
var a = foo()
a()
```

闭包是一种强大的语法
使用不当很容易出现内存泄露
不要为了闭包而闭包
```
function foo() {
	var el = document.getElementById("btn")
	el.onclick = function () {
		console.log(el.id)
	}
	// 在不使用的情况下释放掉
	el = null
}
foo()
```

## 避免属性访问方法使用
js不许属性的访问方法，所有属性都是外部可见的
使用属性访问方法只会增加一层重定义，没有访问的控制力
```
// 27% slower
function Person1() {
	this.name = "coder"
	this.age = 18
	this.getAge = function () {
		return this.age
	}
}
const p1 = new Person1()
const a = p1.getAge()

// fastest
function Person2() {
	this.name = "coder"
	this.age = 18
}
const p2 = new Person2()
const b = p2.age
```

## for 循环优化
```
// 12% slower
var aBtns = document.getElementsByClassName("btn")
for (var i = 0; i < aBtns.length; i++) {
	console.log(i)
}
// fastest
for (var i = 0, len = aBtns.length; i < len; i++) {
	console.log(i)
}
```

## 采用最优循环方式
如果只是要简单的遍历数据，则forEach更佳
```
var arrList = new Array(1, 2, 3, 4, 5)
// fastest
arrList.forEach(i => console.log(i))
// 29% slower
for (var i = arrList.length; i; i--) {
	console.log(i)
}
// 24% slower
for (var i in arrList) {
	console.log(i)
}
```

## 节点添加优化
节点的添加操作必然会有回流和重绘
文档碎片模式添加节点会更快
```
// 24% slower
for (var i = 0; i < 10; i++) {
	var oP = document.createElement("p")
	oP.innerHTML = i
	document.body.appendChild(oP)
}
// fastest
const fragEle = document.createDocumentFragment()
for (var i = 0; i < 10; i++) {
	var oP = document.createElement("p")
	oP.innerHTML = i
	fragEle.appendChild(oP)
}
document.body.appendChild(fragEle)
```

## 克隆优化节点操作
```
var oldP = document.getElementById("box1")
// 53% slower
for (var i = 0; i < 3; i++) {
	var oP = document.createElement("p")
	oP.innerHTML = i
	document.body.appendChild(oP)
}
// fastest
for (var i = 0; i < 3; i++) {
	var newP = oldP.cloneNode(false)
	newP.innerHTML = i
	document.body.appendChild(newP)
}
```

## 直接量替换Object 操作
使用自变量替换new Object的操作
```
// 2% slower
var a1 = new Array(3)
a1[0] = 1
a1[1] = 2
a1[2] = 3
// fastest
var a = [1, 2, 3]
```