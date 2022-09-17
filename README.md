简体中文 | [English](README.en.md)

# dynamic

又叫 `dynamicJS`、`dnJS`，一个简单的、以数据为中心的前端框架，用于创建现代化的网页应用。

# 特性

## 以数据为中心

dynamic 中没有组件的概念，它直接关注数据和模板本身。你可以把 dynamic 理解为字符串模板引擎，但 dynamic 属性实际上支持输出 DOM，所以其实一个属性也可以看作是一个组件。

## 尽量少的 DSL

学习新的语法是恼人的，所以 dynamic 在设计时秉持尽量使用基本 HTML 和 JavaScript 语法的原则，尽量少开发领域特定语言。

与 dynamic 的**全部交互**（包括 HTML 模板）均可以通过 JavaScript 完成，dynamic 的 HTML 模板语法只有三个：

- 插入单向绑定属性：下划线加横线 `_- -_`。
  - 可以用 [`Dynamic().addExport()`](#addExport) 替代。

- 插入双向绑定属性：下划线加冒号 `_: :_`。
  - 双向绑定的使用时机非常少，仅在表单元素或 DOM 编辑场景下有用。但是 dynamic 支持对元素 attribute 的值和元素文本内容进行双向绑定。对 attribute 的键名进行双向绑定是**不合理的**——dynamic 要怎么知道哪个 attribute 是之前那个呢？

> **Note** 提示
>
> 这两个语法可以这样记：外面都是下划线，只有一个（数据传输）方向的就只有一个（横），有两个（数据传输）方向的就有两个（点）。

还有一个和它们不同：

- 规避浏览器和 IDE 对元素 `attributes` 的检查：在属性后加 `:`，如 `id:="_:dynamicID:_"` 可规避 URL 中 `#` 带来的路由问题。

### 自定义语法

最关键的是，dynamic 支持将这些语法的标志进行自定义。任何掌握初级 JavaScript 并且会打开 [`app.ts`](src/app.ts#L15) 的开发者应该都会**修改** dynamic 的 DSL 语法配置。试着 [fork](//github.com/wheelsmake/dynamic/fork) 该项目后将这些符号改成你喜欢的吧！


## 弱化 vDOM

dynamic 拥有 vDOM 功能，但它仅会在很小的范围内打开 vDOM。在很多时候，使用 vDOM 对性能的提升没有什么价值。

- dynamic 使用 [freeDOM](//github.com/wheelsmake/freeDOM) 作为 vDOM 库，这也是一个自制轮子。

## 强依赖 DOM

dynamic 强依赖于 DOM 的不变性，这是弱化 vDOM 所带来的一个缺陷。开发者**不能**绕过 dynamic 控制 DOM，否则将带来不可预测的后果。

## 以网页应用为目标

因此 dynamic 内置了 SPA 路由和 `manifest.json` 动态生成。ServiceWorker 因不支持动态生成，被放在了 [`sw`](//github.com/wheelsmake/sw) 仓库中。

## 不依赖开发环境

依照 LJM12914 的经验，开发环境是让所有开发者都抓狂的一个东西。dynamic 从开始被设计的第一天起就致力于「消灭」开发环境，它被设计得尽量不依赖任何东西，但又可以通过渐进增强的方式获得更多便捷，例如使用 JSX 和使用 TypeScript。

## 像 Vue，但不是 Vue

dynamic 像 Vue 3 的地方包括使用 `Proxy` 进行属性代理、元素 attribute 上的 `:` 语法、HTML 字符串插值，但它其实与 Vue 有很大区别：

1. dynamic 没有计算属性的概念，将属性赋值为一个函数即可立即将其转换为「计算」属性，反之可立即将其转换为普通属性。
2. dynamic 没有 Vue 众多的 HTML 模板指令，并且不允许在 HTML 字符串插值中使用 JavaScript 表达式，只允许单纯属性。
3. dynamic 的绝大多数 API 都不是声明式的，并且创建实例时传入的参数与 Vue 大相径庭。
4. dynamic 是针对网页应用开发而开发的框架，它在理念上将整个网页视为一个整体；而 Vue 的设计更易于开发弹性的、模块化（组件化）的网站，属于通用框架。

# 开始使用

## 获取 dynamic

### 从页面引入脚本

建议将 dynamic 置于所有脚本之前加载。

```html
<script src="path/to/dynamic.js"></script><!--开发-->
<script src="path/to/dynamic.min.js"></script><!--生产-->
```

### 使用打包工具或 TypeScript 开发

克隆仓库或下载仓库，然后在你的代码中导入 `Dynamic`。

```typescript
import Dynamic from "path/to/dynamic.export.ts";
```

注意不要使用 `dynamic.defineGlobal.ts` 而要使用 `dynamic.export.ts`。

## 功能简介（类比 Vue）

通过使用 dynamic 和 Vue 实现同样的应用来帮助你理解 dynamic 的理念和工作原理。

> **Note** 提示
>
> 由于 dynamic 的设计与 Vue 较相似，下文会将 Vue 和 dynamic 进行**直接类比**。
>
> 此举目的在于通过将 dynamic 类比到 Vue 这个有名且被许多人学习过的框架以帮助你理解和学习 dynamic。**请不要因此对两者进行恶意比较、评判或引发消极讨论**，这里是 `Github`，不是 ~~`weibo`~~。
>
> 如果你对 Vue 不熟悉，那么可以跳过这里去浏览下文的[教程](#教程)。
>
> - 请忽视日期处理逻辑中的明显问题。

这是一个 Vue 应用：

```html
<div id="app">
    <div :class="className">
        <ul><li v-for="item in list">{{item}}</li></ul>
        <input v-model="inputs" type="text" />
        <p>{{inputs}}</p>
        <button @click="count++">Count: {{count}}</button>
    </div>
    <span>today is: {{date}}</span>
    <button @click="processDate">tomorrow (date: {{date + 1 &lt;= 31 ? date + 1 : 1}})</button>
</div>
```

Vue 实现方式的 JavaScript：（选项式 API）

```javascript
Vue.createApp({
    data(){
        return{
            className: "myClass",
            list: ["a","b","c"],
            inputs: "",
            count: 0,
            date: new Date().getDate()
        }
    },
    methods: {
        processDate(){
            if(this.date + 1 > 31) this.date = 1;
            else this.date += 1;
        }
    }
}).mount("#app");
```

使用 dynamic 实现这个应用：

```html
<div id="app">
    <div class="_-class-_">
        <ul>_-items-_</ul>
        <input value="_:inputs:_" type="text" />
        <p>_-inputs-_</p>
        <button onclick="this.data.count++">Count: _-count-_</button>
    </div>
    <span>today is: _-date-_</span>
    <button onclick="processDate(this.data)">tomorrow (date: _-tomorrowDate-_)</button>
    <!--或者这样-->
    <!--button onclick="this.method.processDate()">tomorrow (date: _-tomorrowDate-_)</button-->
</div>
```

dynamic 实现方式的 JavaScript：

```javascript
const dy = Dynamic("#app");
const list = ["a","b","c"];
dy.data.items = function(){
    const result = [];
    for(let i = 0; i < list.length; i++){
        const el = document.createElement("li");
        el.textContent = list[i];
        result.push(el);
    }
    return result;
};
dy.data.class = "myClass";
dy.data.inputs = "";
dy.data.count = 0;
dy.data.date = new Date().getDate();
dy.data.tomorrowDate = function(){
    if(this.date + 1 > 31) return 1;
    else return this.date + 1;
};
function processDate(data){
    if(data.date + 1 > 31) data.date = 1;
    else data.date += 1;
}
/*或者这样
dy.addMethods({
    processDate(){
        if(this.date + 1 > 31) this.date = 1;
        else this.date += 1;
    }
});
*/
```

你可能已经有所疑惑。下文将逐语句解释这些 HTML 和 JavaScript，你也可以跳过这里，直接浏览下文的[教程](#教程)。



//todo: 需要注意的是加 `:` 属性的优先级**比没有加 `:` 属性的优先级高**。这是刻意的设计，可以用于一些有初始影响的属性，例如 `id` 属性：`<div id="s1" :id="_:dynamicID:_"></div>`，在带锚点 URL 访问（`http....#s1`）中可以生效。

# 教程

## 引入 dynamic

- 参见[开始使用](#开始使用)。

向你的 HTML  文件中添加一个 `script` 标签以引入 dynamic。建议将 dynamic 置于所有脚本之前或置于 `<head>` 中加载，以避免提前访问 `Dynamic` 导致的问题。

```html
<script src="url/to/dynamic.js"></script>
```

> **Warning** 警告
>
> 不要将创建 dynamic 实例的脚本置于 `<head>` 中，因为 `<head>` 中的脚本将在 HTML 未加载完毕时就运行，进而导致 dynamic 无法获取根节点。

## 创建 dynamic 实例

```typescript
const dy = Dynamic(/*Element或css 选择符*/);
```

传入的唯一参数为根节点，根节点**也会**被该实例管理。

现在你可以看看 `dy` 这个实例里暴露了什么东西。

//todo:



## 不要做的事项

### 不要修改 DOM

dynamic **强依赖**于其作用域内 DOM 的不变性，也因此才可以实现弱化 vDOM 的目标。在创建了 dynamic 实例后，修改实例根节点下的任何 DOM 都可能导致不可预料的问题，包括但不限于判断失误、无法正确修改 DOM 内容、DOM 输出放置位置错误等。

例子：

```html
<div id="el">
    <p id="no">paragraph _:export_sth:_</p>
</div>
```

```javascript
var dy = Dynamic("#el");
Dynamic.e("#no").innerText = ""; 
```

- `chromium` 很喜欢乱删文本节点。详情请见 [`app.ts`](src/app.ts#L459)。

### 不要向属性值传入非纯函数

属性值如果是函数，那么这个函数将在每次该函数依赖的数据属性更新时被执行，这意味着不确定的执行时机和频率。因此，**不要在**这个函数中进行修改外部的操作，（但可以触发异步请求，前提是这个函数不依赖任何数据属性，否则会导致无法及时更新依赖属性的值。）//todo:这个功能未实装

# API 指引 todo:

## 属性与数据绑定

### addExport()

## 模板



## 单页路由



## manifest 动态生成



## 工具方法

### 获取元素

> 从 [`luery`](//github.com/wheelsmake/luery) 处直接复制粘贴的代码。

```typescript
Dynamic.e(s :string, scope? :Element | Document) :Node | Node[];
```

|  参数   |                     描述                      |
| :-----: | :-------------------------------------------: |
|   `s`   |                  css 选择器                   |
| `scope` | `querySelector` 的作用域，不填默认 `document` |

仅当传入选择器的最终选择器为 ID 选择器（即 `#` ）且获取到元素时返回 `Node` 类型单个元素，否则返回  `Node[]` 类型。

### 直接渲染

向文档中渲染任意 HTML。

> **Warning** 警告
>
> 向文档中动态渲染任意 HTML 是**非常危险**的，因为这很可能导致 XSS 攻击（跨站脚本攻击）！
>
> 请仅渲染**完全可信**的内容，**不要直接渲染**含有可由客户端提供的任何信息的 HTML！请先做好字符串转义！

```typescript
Dynamic.render({
    HTML :string | Element | HTMLCollection | Element[] | Node | NodeList | Node[],
    element :Element,
    insertAfter? :boolean,
    append? :boolean
}) :Node[];
```

|     参数      |                             描述                             |
| :-----------: | :----------------------------------------------------------: |
|    `HTML`     | 要渲染的 HTML，可以是上面代码中提到的所有类型，方法会自动将其转换 |
|   `element`   |                           目标元素                           |
| `insertAfter` | `true`：在目标元素后插入 HTML；`false`：在目标元素前插入 HTML |
|   `append`    | `true`：在目标元素中的最后插入 HTML；`false`：在目标元素中的最前插入 HTML；优先级高于 `insertAfter` |

`insertAfter` 和 `append` 的共同缺省值是：在目标元素后插入 HTML。

该方法返回一个由 Node 组成的 Array，包括了 HTML 参数转换为真实 HTML 后的所有顶级元素。

### 字符串转 HTML

将字符串转换为等价 HTML DOM：

```typescript
Dynamic.toHTML(HTML :string) :Node[];
```

|  参数  |       描述       |
| :----: | :--------------: |
| `HTML` | 有效 HTML 字符串 |

### DOM 脱壳

将所有同父元素的元素从它们的父元素里脱出，放入祖父元素内。使用模板时非常实用的方法。

```typescript
Dynamic.hatch(element :Element, remove? :boolean) :Node[];
```

|   参数    |            描述            |
| :-------: | :------------------------: |
| `element` |           父元素           |
| `remove`  | 是否在操作完成后删除父元素 |

该方法返回被脱壳的子元素数组。

### 重复 DOM 操作优化（TODO）

任何对已渲染 DOM 的操作都是比较耗时的，特别是那些会触发重排 / 重绘的操作。对此 dynamic 专门提供了一个优化方法，可以将很多 DOM 操作合并后：

```typescript
Dynamic.compose//todo:
```

| 参数 | 描述 |
| :--: | :--: |
|  ``  |      |
|  ``  |      |



# 补充说明

## 学习 dynamic

可以前往 [`tests/`](tests) 和 [`sample_projects/`](sample_projects) 目录浏览其中的示例项目。其中包括了一些简单的项目和在本文中提到的各种项目的实际实现。

不要拒绝阅读源码！dynamic 的源码还不到 800 行，并且其中还有 30% 是非常详细的注释。大多数疑点旁边都会有一个亲切的 `//` 来告诉你这是什么，因为我记不住为什么要这么写🤣。

## 开发环境搭建

```shell
npm i -D webpack webpack-cli typescript ts-loader terser-webpack-plugin webpack-utf8-bom
```

```shell
tsc --init
```

其他配置详见 [`package.json`](package.json)、[`webpack.config.js`](webpack.config.js) 和 [`webpack.config-min.js`](webpack.config-min.js)。

## 版权声明

本软件以 MIT License 协议开源。

©2020-2022 LJM12914

## 互动

- 欢迎提出issue，但请保持冷静的态度和对事不对人的基本道德准则。
- 请不要在未与我沟通的情况下发起PR。
- 随便 fork。
