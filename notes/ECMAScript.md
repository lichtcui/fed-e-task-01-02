# ECMAScript & JavaScript
ECMAScript 常看作是 JavaScript 的标准化规范，但实际上 JavaScript 是 ECMAScript的扩展语言
ECMAScript只提供了基本的语法，
JavaScript = ECMAScript + DOM + BOM
JavaScript@NodeJs = ECMAScript + fs + net + etc
JavaScript语言本身值得就是 ECMAScript 

## 作用域
作用域： 某个成员能够起作用的范围
- 全局作用域
- 函数作用域
- 块级作用域（es2015新增）
```js
if (true) {
  花括号包裹的范围即块级作用域
  var foo = 'bar'
  let faa = 'bar'
}
console.log(foo) => bar
console.log(faa) => Error: faa is not defined
```

##### var
```js
var elements = [{}, {}, {}]
for (var i = 0;i < elements.length;i++) {
  elements[i].onClick = () => {
    console.log(i)
  }
}
// 打印的始终是全局作用域的i，循环完成后i已经被累加到了3，所以无论打印哪个值都为3
elements[0 or 1 or 2].onClick() // => 3

// var 变量声明的提升
console.log(foo) // => undefined
var foo = 'aaa'
```

##### let
let 必须先声明变量，才能使用变量
```js
for (let i = 0;i < 3;i++) {
  let i = 'bar'
  console.log(i)
} // => 输出三次bar
console.log(foo) // => cannoot access before initialization
let foo = 'aaa'
```

##### const
const 声明变量的同时必须要赋值，是声明之后不允许重新指向一个新的内存地址，可以去修改内存地址中的属性成员
```js
const obj = {}
obj.name = 'abc'
console.log(obj) // => { name: 'abc' }
obj = {} // Error: Assignment to constant variable.
```

## 解构 Destructuring
```js
const [a,b,c] = [100, 200, 300]
console.log(a, b, c) // => 100 200 300

const [,,a] = [100, 200, 300]
console.log(a) // => 300

const [a, ...b] = [100, 200, 300]
console.log(a, b) // => 100 [200, 300]

const [a,b,c,d] = [100, 200, 300]
console.log(a,b,c,d) // => 100 200 300 undefined

const [a,b,c = 123,d = 'default value'] = [100, 200, 300]
console.log(a,b,c,d) // => 100 200 300 default value

const path = '/foo/bar/baz'
const tmp =path.split('/') // => [ '', 'foo', 'bar', 'baz' ]
const rootdir = tmp[1] // => foo
// 简化
const [, rootdir] = path.split('/') // => foo
```

## 对象 根据属性名提取
```js
// 规则与数组类似
const obj = { name: 'abc', age: 18 }
const name = 'tom'
// 当前作用域中有同名的成员会产生冲突
const { name, age } = obj // => Identifier 'name' has already been declared
// 需修改成新的名称，也可设置默认值
const { name: objName = 'jack', age } = obj 
console.log(objName)
```

## 字符串
模版字符串
```js
const str = 'hello world'
const msg = `${str}\nthis is ES2015`
console.log(msg)
=>
hello world
this is ES2015
```
带标签的模版字符串，可以用来实现多语言话，检查存在不安全字符，实现小型模版引擎
```js
const name = 'tom'
const gender = 'male'

const maTagFunc = (strings, name, gender) => {
  console.log(strings) // => [ 'hey, ', ' is a ', '.' ]
  console.log(name) // => tom
  console.log(gender) // => male

  // return '123'
  // console.log(result) => 123

  const sex = gender ? 'man' : 'woman'
  return strings[0] + name + strings[1] + sex + strings[2]
  // console.log(result) => hey, tom is a man.
}

const result = maTagFunc`hey, ${name} is a ${gender}.`
console.log(result)
```
字符串的扩展方法
```js
const msg = 'Error: foo is not defined.'
console.log(msg.startsWith('Error'))
console.log(msg.endsWith('.'))
console.log(msg.includes('foo'))
```

## 函数
参数默认值 Default parameters
```js
// 带有默认值的参数必须放在最后，否则无法正常工作
// 例如 const foo = (bar, enable = true) => {}
const foo = (enable = true) => console.log(enable)
foo() // 传入undefined 或者没有参数 => true
```

剩余参数 Rest parameters
```js
// 只能出现在最后一位，只能使用一次
const foo = (...args) => {
  console.log(args)
}
foo(1,2,3) // => [ 1, 2, 3 ]
```

展开数组
```js
const arr = [1,2,3]
console.log(...arr) // => 1 2 3
```

箭头函数 Arrow functions
- ES6 允许使用“箭头”（`=>`）定义函数
- 如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分
- 如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用`return`语句返回
- 如果箭头函数直接返回一个对象，必须在对象外面加上括号
- 不会改变this的指向
- 不可以当作构造函数，也就是说，不可以使用`new`命令
- 不可以使用`arguments`对象
```js
const arr = [1,2,3,4]
arr.filter(i => i % 2)

const person = {
  name: 'tom',
  // sayHi: function() {
  //   console.log(`hi, my name is ${this.name}`)
  // }, // => hi, my name is tom
  // sayHi: () => {
  //   console.log(`hi, my name is ${this.name}`)
  // }, // => hi, my name is undefined
  sayHi: function() {
    setTimeout(function() {
      console.log(this.name)
    }, 2000)
  }, // => undefined
  sayHi: function() {
    setTimeout(() => console.log(this.name), 2000)
  } // => tom
}
person.sayHi()
```

## Object
对象字面量增强 Enhanced object literals
```js
const bar = '123'
const obj = {
  foo: 123,
  bar,
  method1() {
    console.log('method1')
    console.log(this) // 指向当前obj
  },
  // 计算属性名
  [Math.random()]: 123
}
```

#### Object.assign
将多个源对象中的属性复制到一个目标对象中
```js
// 为options设置默认值
const source1 = { a: 123, b: 123 }
const source2 = { b: 789, d:789 }
const target = { a: 456, c: 456 }

// 用后面对象的属性覆盖第一个对象
const result = Object.assign(target, source1, source2)

console.log(target) // { a: 123, c: 456, b: 123 }
console.log(result === target) // true

function func(obj) {
  // 指向同一个内存地址，同一个数据
  // obj.name = 'func obj'
  // console.log(obj)

  // 只希望在内部修改对象
  // 复制一个对象到全新空对象，它的修改不会影响到外部的数据
  const funcObj = Object.assign({}, obj)
  funcObj.name = 'func obj'
  console.log(funcObj)
}

const obj = { name: 'global obj' }
func(obj)
console.log(obj)
```

#### Object.is
== 会在比较前自动转换数据类型  
=== 严格相等  
```js
0 == false => true
0 === false => false
+0 === -0 => true
NaN === NaN => false
Object.is(+0, -0) => false
Object.is(NaN, NaN) => true
```

## Proxy
为对象设置访问代理器
```js
const person = { name: 'abc', age: 18 }
const personProxy = new Proxy(person, {
  // 代理的处理对象
  // get 监视属性的访问
  get(target, property) {
    // 正常逻辑
    return property in target ? target[property] : undefined

    // console.log(target, property)
    // return 100
  },
  // set 监视设置属性的过程
  set(target, property, value) {
    if (property === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError(`${value} is not an int`)
      }
    }

    // 正常逻辑
    target[property] = value

    // console.log(target, property, value)
  }
})
personProxy.gender = 'male'
personProxy.age = '1' // 报错
console.log(personProxy.name) // => get方法的返回值
```

- Object.defineProperty 只能监视属性的读写
- Proxy 能够监视到更多的对象操作

handler方法|触发方式
-|-
get|读取某个属性
set|写入某个属性
has|in操作符
deleteProperty|delete操作符
getPrototypeOf|Object.getPrototypeOf()
setPrototypeOf|Object.setPrototypeOf()
isExtensible|Object.isExtensible()
preventExtensions|Object.preventExtensions()
getOwnPropertyDescriptor|Object.getOwnPropertyDescriptor()
defineProperty|Object.defineProperty()
ownKeys|Object.getOwnPropertyNames()、Object.getOwnPropertySymbols()
apply|调用一个函数
construct|用new调用一个函数

> proxy更好的支持数组对象的监视, proxy是以非侵入的方式监管了对象的读写
```js
const list = []
const listProxy = new Proxy(list, {
  set(target, index, value) {
    console.log('set', index, value)
    target[index] = value
    return true // 表示写入成功
  }
})
listProxy.push(100)
```

## Reflect
- 统一的对象操作 API
- Reflect 属于一个静态类，不能用new去构建一个实例对象，只能调用静态方法
- Reflect 内部封装了一系列对对象的底层操作
- Reflect 成员方法就是Proxy处理对象的默认实现
```
const obj = { name: 'abc', age: 18 }
const proxy = new Proxy(obj, {
  // 没有定义get方法的话等同于调用Reflect方法
  get(target, property) {
    return Reflect.get(target, property)
  }
})

console.log('name' in obj)
console.log(delete obj['age'])
console.log(Object.keys(obj))

// Reflect 改写
console.log(Reflect.has(obj, 'name'))
console.log(Reflect.deleteProperty(obj, 'age'))
console.log(Reflect.ownKeys(obj))
```

## Promise
解决了传统异步编程过程中回调函数嵌套过深的问题

- 对象的状态不受外界影响。`Promise`对象代表一个异步操作，有三种状态：`pending`（进行中）、`fulfilled`（已成功）和`rejected`（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是`Promise`这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。

- 一旦状态改变，就不会再变，任何时候都可以得到这个结果。`Promise`对象的状态改变，只有两种可能：从`pending`变为`fulfilled`和从`pending`变为`rejected`。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对`Promise`对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

## class类
- `constructor`方法是类的默认方法，通过`new`命令生成对象实例时，自动调用该方法。一个类必须有`constructor`方法，如果没有显式定义，一个空的`constructor`方法会被默认添加。
- 与 ES5 一样，实例的属性除非显式定义在其本身（即定义在`this`对象上），否则都是定义在原型上（即定义在`class`上）。
- 与 ES5 一样，类的所有实例共享一个原型对象
- 与 ES5 一样，在“类”的内部可以使用`get`和`set`关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。
- 类的属性名，可以采用表达式
```js
let methodName = "getArea";

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return "(" + this.x + ", " + this.y + ")";
  }

  get prop() {
    return "getter";
  }
  set prop(value) {
    console.log("setter: " + value);
  }

  [methodName]() {
    // ...
  }
}

var point = new Point(2, 3);

point.toString(); // (2, 3)
point.hasOwnProperty("x"); // true
point.hasOwnProperty("y"); // true
point.hasOwnProperty("toString"); // false
point.__proto__.hasOwnProperty("toString"); // true

var p1 = new Point(2, 3);
var p2 = new Point(3, 2);
p1.__proto__ === p2.__proto__; //true

var inst = new Point(2, 3);
inst.prop = 123; // setter: 123
inst.prop; // 'getter'
```

## 静态方法 static
静态方法：直接通过类型本身调用
实例方法：通过类型构造的实例对象调用
```
class Person {
  constructor(name) {
    this.name = name
  }

  say() {
    console.log(`hello ${this.name}`)
  }

  static create(name) {
    return new Person(name)
  }
}

const abc = Person.create('abc')
abc.say()
因为静态方法是挂载到类型上的，所以静态方法的内部不会指向某一个实例对象，而是当前的类型
```

## 类的继承 extends
- Class 可以通过`extends`关键字实现继承
- 在子类的构造函数中，只有调用`super`之后，才可以使用`this`关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有`super`方法才能调用父类实例。
```
class Student extends Person {
  constructor(name, id) {
    super(name)
    this.id = id
  }
  hello() {
    super.say()
    console.log(`my id is ${this.id}`)
  }
}

const a = new Student('adam', 1)
a.hello()
```

##### super
- `super`作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次`super`函数。
- `super`作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类
- 由于`super`指向父类的原型对象(prototype)，定义在父类实例上的方法或属性，是无法通过`super`调用的
```js
class A {
  constructor() {
    this.p = 2;
  }
}
class B extends A {
  get m() {
    return super.p;
  }
}
let b = new B();
b.m; // undefined
```

## Set

## set 数据结构（集合）
- 它类似于数组，但是成员的值都是唯一的，没有重复的值
- `Set`本身是一个构造函数，用来生成 Set 数据结构
- `Set`函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化

##### 去重
```
// 数组去重
[...new Set([1, 2, 3, 2, 4, 5])]; //[1,2,3,4,5]

// 字符串去重
[...new Set("ababbc")].join(""); //"abc"
```

##### 属性
- `Set.prototype.add(value)`：添加某个值，返回 Set 结构本身
- `Set.prototype.delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功
- `Set.prototype.has(value)`：返回一个布尔值，表示该值是否为`Set`的成员。
- `Set.prototype.clear()`：清除所有成员，没有返回值
```
const s = new Set()
// 如果添加已存在的值，则这个值会被忽略掉
s.add(1).add(2).add(3).add(4).add(1)
// 获取整个集合的长度
s.size
// 查看是否有相应的值
s.has(100)
// 删除某个值，删除成功回返回true
s.delete(1)
// 用于清除集合中的全部内容
s.clear()
```

##### 方法
- `Set.prototype.keys()`：返回键名的遍历器
- `Set.prototype.values()`：返回键值的遍历器
- `Set.prototype.entries()`：
  ```js
    let set = new Set(["red", "green", "blue"]);
    for (let item of set.entries()) {
      console.log(item);
    }
    // ["red", "red"]
    // ["green", "green"]
    // ["blue", "blue"]
    ```
- `Set.prototype.forEach()`：遍历

## Map
Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。

作为构造函数，Map 也可以接受一个数组作为参数。该数组的成员是一个个表示键值对的数组
```js
const map = new Map([
  ["name", "张三"],
  ["title", "Author"],
]);
map.size; // 2
map.has("name"); // true
map.get("name"); // "张三"
map.has("title"); // true
map.get("title"); // "Author"
```

#### 属性和方法
- size 属性，`size`属性返回 Map 结构的成员总数。
- Map.prototype.set(key, value) `set`方法设置键名`key`对应的键值为`value`，然后返回整个 Map 结构。如果`key`已经有值，则键值会被更新，否则就新生成该键， set()方法返回的是 set 对象可以采用链式写法
- Map.prototype.get(key) `get`方法读取`key`对应的键值，如果找不到`key`，返回`undefined`。
- Map.prototype.has(key)`has`方法返回一个布尔值，表示某个键是否在当前 Map 对象之中
- Map.prototype.delete(key)`delete`方法删除某个键，返回`true`。如果删除失败，返回`false`
- Map.prototype.clear()`clear`方法清除所有成员，没有返回值
```js
const map = new Map();
map.set("foo", true);
map.set("bar", false);

map.get("foo"); // true
map.has("years"); // false
map.size; // 2

m.delete("years");
map.has("years"); // false

map.clear();
map.size; // 0
```

#### 遍历
- `Map.prototype.keys()`：返回键名的遍历器。
- `Map.prototype.values()`：返回键值的遍历器
- `Map.prototype.entries()`：返回所有成员的遍历器
- `Map.prototype.forEach()`：遍历 Map 的所有成员
```js
const map = new Map([["F", "no"], ["T", "yes"]]);

for (let key of map.keys()) {
  console.log(key);
}
// "F"
// "T"

for (let value of map.values()) {
  console.log(value);
}
// "no"
// "yes"

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"
map.forEach(function (value, key, map) {
  console.log("Key: %s, Value: %s", key, value);
});
```  

## Symbol
表示独一无二的值，通过`Symbol`函数生成。对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。
```js
var obj = { say: "lagou" };
var say = Symbol(); //say 是symbol类型
obj[say] = "web";
console.log(obj); //{say: "lagou", Symbol(): "web"}
```

##### 语法
- `Symbol`函数前不能使用`new`命令，否则会报错
- `Symbol`函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分
- 每一个 Symbol 值都是不相等的，这意味着 Symbol 值可以作为标识符，用于对象的属性名，就能保证不会出现同名的属性
- Symbol 值不能与其他类型的值进行运算，会报错
- Symbol 值作为对象属性名时，不能用点运算符

```js
var a = Symbol();
var b = Symbol();
console.log(a === b); //false
var a = Symbol("a");
var b = Symbol("b");
console.log(a === b); //false

// `Symbol`函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的`Symbol`函数的返回值是不相等的
var a = Symbol("a");
var b = Symbol("a");
console.log(a === b); //false

// 不能与其他类型的值进行运算
let sym = Symbol("My symbol");
"your symbol is " + sym // TypeError: can't convert symbol to string
`your symbol is ${sym}`; // TypeError: can't convert symbol to string

// - Symbol 值作为对象属性名时，不能用点运算符
const mySymbol = Symbol();
const a = {};
a.mySymbol = "Hello!";
console.log(a[mySymbol]); //undefined
console.log(a["mySymbol"]); //hello
```

`Symbol.for()`为 Symbol 值登记的名字，是全局环境的，不管有没有在全局环境运行
```js
Symbol.for("bar") === Symbol.for("bar"); // true

function foo() {
  return Symbol.for("bar");
}

const x = foo();
const y = Symbol.for("bar");
console.log(x === y); // true
```

`Object.getOwnPropertySymbols()`方法，可以获取指定对象的所有 Symbol 属性名。该方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。
```js
const obj = {};
let a = Symbol("a");
let b = Symbol("b");
obj[a] = "Hello";
obj[b] = "World";
const objectSymbols = Object.getOwnPropertySymbols(obj);
console.log(objectSymbols); //[Symbol(a), Symbol(b)]
```

## 可迭代接口（Iterater）
- 为各种数据结构，提供一个统一的、简便的访问接口
- 使得数据结构的成员能够按某种次序排列
- ES6 创造了一种新的遍历命令`for...of`循环，Iterator 接口主要供`for...of`消费。

##### Iterator 的遍历过程
- 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。
- 第一次调用指针对象的`next`方法，可以将指针指向数据结构的第一个成员
- 第二次调用指针对象的`next`方法，指针就指向数据结构的第二个成员
- 不断调用指针对象的`next`方法，直到它指向数据结构的结束位置

每一次调用`next`方法，返回一个包含`value`和`done`两个属性的对象。其中，`value`属性是当前成员的值，`done`属性是一个布尔值，表示遍历是否结束
```js
var it = easyIterator(["a", "b"]);

it.next(); // { value: "a", done: false }
it.next(); // { value: "b", done: false }
it.next(); // { value: undefined, done: true }

function easyIterator(array) {
  var nextIndex = 0;
  return {
    next: function () {
      return nextIndex < array.length
        ? { value: array[nextIndex++], done: false }
        : { value: undefined, done: true };
    },
  };
}
```

##### Iterater 接口
```js
var st = "lagou";
for (i of st) {
  console.log(i); // l a g o u
}
var arr = [1, 2];
for (v of arr) {
  console.log(v); //1 2
}
function fn(a, b, c) {
  for (i of arguments) {
    console.log(i); //1 2 3
  }
}
fn(1, 2, 3);
```

## Modules
#### 语法
- export
  - `export`命令用于规定模块的对外接口
  - 一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。如果你希望外部能够读取模块内部的某个变量，就必须使用`export`关键字输出该变量。
- import
  - `import`命令用于输入其他模块提供的功能
  - `import`命令接受一对大括号，里面指定要从其他模块导入的变量名。大括号里面的变量名，必须与被导入模块对外接口的名称相同
- export default
  - 为模块指定默认输出
  - 本质上，`export default`就是输出一个叫做`default`的变量或方法，然后系统允许你为它取任意名字
  - 在`import`命令后面，不再使用大括号
  - `export default`命令用于指定模块的默认输出。显然，一个模块只能有一个默认输出，因此`export default`命令只能使用一次

#### 浏览器端加载实现
浏览器加载 ES6 模块，也使用标签，但是要加入`type="module"`属性
```
<script type="module">import {a} from "./01.js"; console.log(a)//123</script>
```
脚本异步加载
- 标签打开`defer`或`async`属性，脚本就会异步加载。渲染引擎遇到这一行命令，就会开始下载外部脚本，但不会等它下载和执行，而是直接执行后面的命令
- defer 是“渲染完再执行”，要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行
- async 是“下载完就执行”，一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染
- 如果有多个 defer 脚本，会按照它们在页面出现的顺序加载，而多个 async 脚本是不能保证加载顺序的
```
<script src="path/to/myModule.js" defer></script>
<script src="path/to/myModule.js" async></script>
```