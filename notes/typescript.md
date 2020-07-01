# TypeScript
类型安全
- 强类型
	- 有类型上的约束，不允许任意的隐式类型转换
	- 错误更早暴露
	- 代码智能，编码准备
	- 重构更加牢靠
	- 减少不必要的类型判断
- 弱类型
	- 没有类型上的约束 允许任意的隐式类型转换

类型检查
- 静态类型
- 动态类型

## js 类型系统
- js 没有编译环节，没有类型检测，只有在运行的时候，才能检测错误
- 弱类型动态类型语言 (强类型语言在语法上就会报错，不会遗留到运行阶段)
- 类型不明确，函数功能发生改变
- 对象索引器的转换

```js
let obj = {};
console.log(obj.fn());
//在语法上可行，但是运行的时候报错
let obj = {};
setTimeout(() => {
	obj.fn(); //这是一件很可怕的事情，会留下隐患
}, 10000);

function sum(a, b) {
    return a + b;
  }
sum(100, 100);
sum(100, "100");

const obj = {};
obj[true] = 100;
console.log(obj[true]);
```

## Flow
静态类型检测器  
原理：
  - 在代码当中添加一些类型注解的方式标记每个变量和参数是什么类型，flow 根据这些类型注解，检查代码当中是否存在类型使用上的异常，从而在开发阶段就检测到了类型异常的使用，从而避免了在运行阶段类型异常的错误。
  - 类型注解写法，在变量后 加上 ：type 进行类型注解
	```js
	function sum(a: number, b: number) {
		return a + b;
	}
	```

## Primitive
```js
const a: string = 'foobar'
const b: number = 100 // NaN Infinity
const c: boolean = true
const d: void = undefined
const g: null = null
const h: undefined = undefined
const i: symbol = Symbol()
```

## Object
```js
const obj: { name: string } = { name: 'abc' }
```

## Array
```js
const isArr = (arr: number[]) => {}
```

## Tuple
```js
const tuple: [number, string] = [18, 'abc']
```

## Enum
```js
enum PostStatus {
  Draft,
  Unpublished,
  Published,
}
const post = { status: PostStatus.Published }

// const enum PostStatus {...}
// 编译后会变成
// status: PostStatus.Draft => status: 0
```

## Function
```js
const func = (a: number,b: number = 10): string => `${a},${b}`
const func2: (a: number,b?: number) => string = (a,b) => `${a},${b}`
```

## Any
```js
const stringify = (value: any) => JSON.stringify(value)
```

## 隐式类型推断 Type Inference
```js
let age = 18
age = 'string'
TSError: Type '"string"' is not assignable to type 'number'
```

## 类型断言 Type assertions
```js
const nums: number[] = [110, 120, 130, 140]
const res = nums.find(i=> i > 100)
const square = res * res
// => Object is possibly 'undefined'

const num1 = res as number
const num2 = <number>res // jsx 下不能使用
const square = num1 * num1
```

## 接口 Interfaces
```js
export {} // 确保跟其他示例没有成员冲突

interface Post {
	title: string
	content: string
	subtitle?: string // 可选成员
	readonly summary: string // 只读成员 不可被修改
}

interface Cache {
	[prop: string]: string
}

const cache: Cache = {}
cache.foo = "foo"
cache.bar = "bar"
```

## 类
控制类内部成员的可访问级别
```js
export {}

interface Hello {
	sayHi(msg: string): void
}

class Person implements Hello {
	public name: string // 默认为public
	private age: number // 只能在类的内部访问，不能在外部访问
	protected readonly gender: boolean // 只允许在子类中去访问，不能在外部访问
	// readonly 只读
	// protected readonly 如果已经有了访问修饰符
	// 类中初始化，或者构造函数中初始化
	constructor(name: string, age: number) {
		this.name = name
		this.age = age
		this.gender = true
	}
	sayHi(msg: string) {
		console.log(`Hi, ${msg}`)
	}
}

class Student extends Person {
	// 不可直接使用new student()，只能使用静态方法来创建
	private constructor(name: string, age: number) {
		super(name, age)
		console.log(this.gender)
	}
	static create(name: string, age: number) {
		return new Student(name, age)
	}
}
```

## 抽象类
被定义成抽象类后只能通过继承不能通过 new 来创建对应实例对象
```js
abstract class Animal {
	eat(food: string) {}
	// 抽象方法，不需要方法体
	// 父类有抽象方法，子类必须实现
	abstract run(distance: number): void
}

class Dog extends Animal {
	run(distance: number): void {}
}
```

## 泛型 Generics
定义函数、接口、类的时候没有指定具体类型，等到调用的时候在指定
```js
const createArray = <T>(length: number, value: T) =>
	Array<T>(length).fill(value)

const res = createArray(3, 2)
```

## 类型声明 Declaration
```js
// declare function camelCase(input: string): string
const res = camelCase("hello typed")
```
