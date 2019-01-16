
# JavaScript 设计模式 #

## 构造函数模式 ##
ECMAScript中的构造函数可以用来创建特定类型的对象。像Object 和 Array 这样的原生构造函数，在运行时会自动出行在执行环境中。
此外，也可以创建自定义构造函数，从而定义自定义对象类型的属性和方法。
```
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function() {
        alert(this.name);
    };
}

var person1 = new Person("Nicholas",29,"software Engineer");
var person2 = new Person("Greg",27,"Doctor");
```
这里需要注意：

构造函数始终都应该以一个大写字母开头，而非构造函数则以一个小写字母开头

要创建Person的实例，必须使用new操作符。以这种方式调用构造函数实例上会经历以下4个步骤：

1. 创建一个对象
2. 将构造函数的作用域赋给新对象（因此this就指向了这个新对象）
3. 执行构造函数中的代码
4. 返回新的对象

在前面例子的最后person1和person2分别保存着Person的一个不同的实例。这两个对象都有一个constructor（构造函数）属性，该属性指向Person,如下所示。

```
alert(person1.constructor == Person); // true
alert(person2.constructor == Person); // true
```
对象的constructor属性最初是用来标识对象类型的。但是，提到检测对象类型，还是instanceof操作符要可靠一些。我们在这个例子中创建的所有对象即是Object的实例同时也是Person的实例，这一点通过instanceof操作符可以得到验证。
```
alert(person1 instanceof Object); // true
alert(person1 instanceof Person); // true
alert(person2 instanceof Object); // true
alert(person2 instanceof Person); // true
```


## 单体模式 ##
单体模式提供了一种将代码组织为一个逻辑单元的手段，这个逻辑单元中的代码可以通过单一变量进行访问。

<!-- more -->

单体模式的优点是：

- 可以用来划分命名空间，减少全局变量的数量。
- 使用单体模式可以使代码组织的更为一致，使代码容易阅读和维护。
- 可以被实例化，且实例化一次。

单体模式是一个用来划分命名空间并将一批属性和方法组织在一起的对象，如果它可以被实例化，那么它只能被实例化一次。
但是并非所有的对象字面量都是单体，比如说模拟数组或容纳数据的话，那么它就不是单体，但是如果是组织一批相关的属性和方法在一起的话，那么它有可能是单体模式，所以这需要看开发者编写代码的意图。

但是并非所有的对象字面量都是单体，比如说模拟数组或容纳数据的话，那么它就不是单体，但是如果是组织一批相关的属性和方法在一起的话，那么它有可能是单体模式，所以这需要看开发者编写代码的意图；

下面定义一个对象字面量(结构类似于单体模式)的基本结构：

```
// 对象字面量
var Singleton = {
    attr1: 1,
    attr2: 2,
    method1: function(){
        return this.attr1;
    },
    method2: function(){
        return this.attr2;
    }
};
```
如上面只是简单的字面量结构，上面的所有成员变量都是通过Singleton来访问的，但是它并不是单体模式；因为单体模式还有一个更重要的特点，就是可以仅被实例化一次，上面的只是不能被实例化的一个类，因此不是单体模式；对象字面量是用来创建单体模式的方法之一；

单体模式如果有实例化的话，那么只实例化一次，要实现一个单体模式的话，我们无非就是使用一个变量来标识该类是否被实例化，如果未被实例化的话，那么我们可以实例化一次，否则的话，直接返回已经被实例化的对象。
```
// 单体模式
var Singleton = function(name){
    this.name = name;
    this.instance = null;
};
Singleton.prototype.getName = function(){
    return this.name;
}
// 获取实例对象
function getInstance(name) {
    if(!this.instance) {
        this.instance = new Singleton(name);
    }
    return this.instance;
}
// 测试单体模式的实例
var a = getInstance("aa");
var b = getInstance("bb");
```

上面的封装单体模式也可以改成如下结构写法：
```
// 单体模式
var Singleton = function(name){
    this.name = name;
};
Singleton.prototype.getName = function(){
    return this.name;
}
// 获取实例对象
var getInstance = (function() {
    var instance = null;
    return function(name) {
        if(!instance) {
            instance = new Singleton(name);
        }
        return instance;
    }
})();
// 测试单体模式的实例
var a = getInstance("aa");
var b = getInstance("bb");
```

使用单体模式来实现弹窗的基本原理

通常情况下，编写代码来实现弹窗效果;，比如有一个弹窗，默认的情况下肯定是隐藏的，点击时，显示出来：
```
// 实现弹窗
var createWindow = function(){
    var div = document.createElement("div");
    div.innerHTML = "我是弹窗内容";
    div.style.display = 'none';
    document.body.appendChild('div');
    return div;
};
document.getElementById("Id").onclick = function(){
    // 点击后先创建一个div元素
    var win = createWindow();
    win.style.display = "block";
}
```
如上的代码；大家可以看看，有明显的缺点，比如我点击一个元素需要创建一个div，我点击第二个元素又会创建一次div，我们频繁的点击某某元素，他们会频繁的创建div的元素，虽然当我们点击关闭的时候可以移除弹出代码，但是呢我们频繁的创建和删除并不好，特别对于性能会有很大的影响，对DOM频繁的操作会引起重绘等，从而影响性能；因此这是非常不好的习惯；我们现在可以使用单体模式来实现弹窗效果，我们只实例化一次就可以了；如下代码：
```
// 实现单体模式弹窗
var createWindow = (function(){
    var div;
    return function(){
        if(!div) {
            div = document.createElement("div");
            div.innerHTML = "我是弹窗内容";
            div.style.display = 'none';
            document.body.appendChild(div);
        }
        return div;
    }
})();
document.getElementById("Id").onclick = function(){
    // 点击后先创建一个div元素
    var win = createWindow();
    win.style.display = "block";
}
```

如上代码，创建div的代码和创建iframe代码很类似，现在可以把通用的代码分离出来，使代码变成完全抽象，编写一套代码封装在getInstance函数内，如下代码：
```
var getInstance = function(fn) {
    var result;
    return function(){
        return result || (result = fn.call(this,arguments));
    }
};
```
如上代码：使用一个参数fn传递进去，如果有result这个实例的话，直接返回，否则的话，当前的getInstance函数调用fn这个函数，是this指针指向与这个fn这个函数；之后返回被保存在result里面；现在我们可以传递一个函数进去，不管是创建div也好，还是创建iframe也好，总之如果是这种的话，都可以使用getInstance来获取他们的实例对象；

如下代码：
```
// 创建div
var createWindow = function(){
    var div = document.createElement("div");
    div.innerHTML = "我是弹窗内容";
    div.style.display = 'none';
    document.body.appendChild(div);
    return div;
};

// 获取实例的封装代码
var getInstance = function(fn) {
    var result;
    return function(){
        return result || (result = fn.call(this,arguments));
    }
};

// 测试创建div
var createSingleDiv = getInstance(createWindow);
document.getElementById("Id").onclick = function(){
    var win = createSingleDiv();
    win.style.display = "block";
};
```

## 模块模式 ##
模块模式的思路是为单体模式添加私有变量和私有方法能够减少全局变量的使用；如下就是一个模块模式的代码结构：
```
var singleMode = (function(){
    // 创建私有变量
    var privateNum = 112;
    // 创建私有函数
    function privateFunc(){
        // 实现自己的业务逻辑代码
    }
    // 返回一个对象包含公有方法和属性
    return {
        publicMethod1: publicMethod1,
        publicMethod2: publicMethod1
    };
})();
```
模块模式使用了一个返回对象的匿名函数。在这个匿名函数内部，先定义了私有变量和函数，供内部函数使用，然后将一个对象字面量作为函数的值返回，返回的对象字面量中只包含可以公开的属性和方法。这样的话，可以提供外部使用该方法；由于该返回对象中的公有方法是在匿名函数内部定义的，因此它可以访问内部的私有变量和函数。

什么时候使用模块模式？

如果我们必须创建一个对象并以某些数据进行初始化，同时还要公开一些能够访问这些私有数据的方法，那么我们这个时候就可以使用模块模式了。

理解增强的模块模式

增强的模块模式的使用场合是：适合那些单列必须是某种类型的实例，同时还必须添加某些属性或方法对其加以增强的情况。比如如下代码：
```
function CustomType() {
    this.name = "tugenhua";
};
CustomType.prototype.getName = function(){
    return this.name;
}
var application = (function(){
    // 定义私有
    var privateA = "aa";
    // 定义私有函数
    function A(){};

    // 实例化一个对象后，返回该实例，然后为该实例增加一些公有属性和方法
    var object = new CustomType();

    // 添加公有属性
    object.A = "aa";
    // 添加公有方法
    object.B = function(){
        return privateA;
    }
    // 返回该对象
    return object;
})();
```
下面我们来打印下application该对象；如下：
```
console.log(application);
```

继续打印该公有属性和方法如下：
```
console.log(application.A);// aa

console.log(application.B()); // aa

console.log(application.name); // tugenhua

console.log(application.getName());// tugenhua
```

## 工厂模式 ##
工厂模式类似于现实生活中的工厂可以产生大量相似的商品，去做同样的事情，实现同样的效果;这时候需要使用工厂模式。

简单的工厂模式可以理解为解决多个相似的问题;这也是它的优点;比如如下代码： 
```
function CreatePerson(name,age,sex) {
    var obj = new Object();
    obj.name = name;
    obj.age = age;
    obj.sex = sex;
    obj.sayName = function(){
        return this.name;
    }
    return obj;
}
var p1 = new CreatePerson("xiaoyu",'18','男');
var p2 = new CreatePerson("xiaoli",'20','女');

console.log(p1.name); 
console.log(p1.age);  
console.log(p1.sex);  
console.log(p1.sayName()); 

console.log(p2.name);   
console.log(p2.age);   
console.log(p2.sex);   
console.log(p2.sayName()); 

// 返回都是object 无法识别对象的类型 不知道他们是哪个对象的实列
console.log(typeof p1);  // object
console.log(typeof p2);  // object
console.log(p1 instanceof Object); // true
```
如上代码：函数CreatePerson能接受三个参数name,age,sex等参数，可以无数次调用这个函数，每次返回都会包含三个属性和一个方法的对象。

工厂模式是为了解决多个类似对象声明的问题;也就是为了解决实列化对象产生重复的问题。

优点：能解决多个相似的问题。

缺点：不能知道对象识别的问题(对象的类型不知道)。

复杂的工厂模式定义是：将其成员对象的实列化推迟到子类中，子类可以重写父类接口方法以便创建的时候指定自己的对象类型。

父类只对创建过程中的一般性问题进行处理，这些处理会被子类继承，子类之间是相互独立的，具体的业务逻辑会放在子类中进行编写。

父类就变成了一个抽象类，但是父类可以执行子类中相同类似的方法，具体的业务逻辑需要放在子类中去实现；比如我现在开几个自行车店，那么每个店都有几种型号的自行车出售。我们现在来使用工厂模式来编写这些代码;

## 观察者模式 ##
观察者模式，也称作"发布-订阅 (Publish/Subscribe)模式"，是 js 设计模式中比较常用的模式之一。
它定义了一种一对多的依赖关系，当一个对象发生改变时，所有依赖它的对象都将得到通知和更新。

```

//创建发布者
function Publisher() {
  this.observers = []; //订阅者
  this.content = '';   //发布内容
}

//订阅者订阅方法
Publisher.prototype.addObserver = function (observer) {
    var isObserver = false,
        observers = this.observers;
    for(var i = 0; i < observers.length; i++) {
        if(observers[i] === observer) {
            isObserver = true;
        }
    }
    if(!isObserver) {
      observers.push(observer);
    }
}

//订阅者取消订阅方法
Publisher.prototype.removeObserver = function (observer) {
    var observers = this.observers;
    for(var i = 0; i < observers.length; i++) {
        if(observers[i] === observer){
            observers.splice(i, 1);
        }
    }
}

//发布者推送通知
Publisher.prototype.notice = function () {
    var observers = this.observers;
    for(var i = 0; i < observers.length; i++) {
        observers[i].update(this.content);
    }
}

//创建订阅者
function Subscriber() {
    this.update = function (data) {
        console.log(data);
    }
}

//创建发布者/订阅者
var publisher = new Publisher();
var subscriber = new Subscriber();

//JDer订阅JDSTAR
publisher.addObserver(subscriber);

//发布者更新了内容,并推送给所有订阅者
publisher.content = "publisher 发布了一条消息";
publisher.notice();
```
观察者模式使发布者与订阅者耦合性降低，发布者只管发布一条消息出去，它不关心这条消息如何被订阅者使用，同时，订阅者只监听发布者的事件名，只要发布者的事件名不变，它不管发布者如何改变，只要更新了就通知订阅者。

## 小结 ##
维基百科是这样定义设计模式的：

> 在软件工程中，设计模式（design pattern）是对软件设计中普遍存在（反复出现）的各种问题，所提出的解决方案。
> 设计模式能使不稳定依赖于相对稳定、具体依赖于相对抽象，避免会引起麻烦的紧耦合，以增强软件设计面对并适应变化的能力。

总体来说设计模式分为三大类（共 23 种）：

1. 创建型模式 共五种：

    工厂方法模式、抽象工厂模式、单例模式、建造者模式、原型模式。

2. 结构型模式 共七种：

    适配器模式、装饰器模式、代理模式、外观模式、桥接模式、组合模式、享元模式。

3. 行为型模式 共十一种：

    策略模式、模板方法模式、观察者模式、迭代子模式、责任链模式、命令模式、备忘录模式、状态模式、访问者模式、中介者模式、解释器模式。
