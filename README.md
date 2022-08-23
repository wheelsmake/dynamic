中文 | [English](README.en.md)

# dynamic

又叫 `dynamicJS`、`dnJS`，一个简单的、以数据为中心的前端框架，用于创建现代化的网页应用。

# 特性

## 以数据为中心

dynamic 中没有组件的概念，它直接关注数据本身。你可以把 dynamic 理解为字符串模板引擎，但 dynamic 属性实际上支持输出 DOM，所以其实一个属性也可以看作是一个组件。

## 尽量少的 DSL

学习新的语法是恼人的，所以 dynamic 在设计时秉持尽量使用基本 HTML 和 JavaScript 语法的原则，尽量少开发领域特定语言。

与 dynamic 的**全部交互**（包括 HTML 模板）均可以通过 JavaScript 完成，dynamic 的 HTML 模板语法只有三个：

- 插入单向绑定属性：下划线加横线 `_- -_`。
  - 可以用 [`Dynamic.new().addExport()`](#addExport()) 替代。

- 插入双向绑定属性：下划线加冒号 `_: :_`。
  - 双向绑定的使用时机非常少，仅在表单元素或 DOM 编辑场景下有用。但是 dynamic 支持**所有合理的双向绑定**：attribute 的值和文本内容。对 attribute 的键名进行双向绑定是**不合理的**——dynamic 要怎么知道哪个 attribute 是之前那个呢？


这两个语法可以这样记：外面都是下划线，只有一个方向的就只有一个（横），有两个方向的有两个（点）。还有一个和它们不同：

- 规避浏览器和 IDE 对元素 `attributes` 的检查：在属性后加 `:`，如 `id:="_:dynamicID:_"` 可规避 URL 中 `#` 带来的路由问题。

并且，任何掌握初级 JavaScript 语法并且会打开 [`app.ts`](src/app.ts#L20) 的开发者应该都会**修改** dynamic 的 DSL 配置。试着 [fork](//github.com/wheelsmake/dynamic/fork) 该项目后将这些符号改成你喜欢的吧！


## 弱化 vDOM

dynamic 拥有 vDOM 功能，但它极少并仅会在很小的范围内打开 vDOM。在很多时候，使用 vDOM 对性能的提升没有什么价值。

- dynamic 使用 [freeDOM](//github.com/wheelsmake/freeDOM) 作为 vDOM 库，这也是一个自制轮子。

## 强接管 DOM

dynamic 强依赖于 DOM 的不变性。开发者**不能**绕过 dynamic 控制 DOM，否则将带来不可预测的后果。

## 以网页应用为目标

因此 dynamic 内置了 SPA 路由和 `manifest.json` 动态生成。ServiceWorker 因不支持动态生成，被放在了 [`sw`](//github.com/wheelsmake/sw) 仓库中。

## 不依赖开发环境

依照 LJM12914 的经验，开发环境是让所有开发者都抓狂的一个东西。dynamic 从开始被设计的第一天起就致力于「消灭」开发环境，它被设计得尽量不依赖任何东西，但又可以通过渐进增强的方式获得更多便捷，例如使用 JSX 和使用 TypeScript。

## 像 Vue，但不是 Vue

dynamic 像 Vue 3 的地方包括使用 `Proxy` 进行属性代理、HTML DOM 上的 `:` 语法、HTML 字符串插值，但它其实与 Vue 有很大区别：

1. dynamic 没有计算属性的概念，将属性赋值为一个函数即可立即将其转换为「计算」属性，反之可立即将其转换为普通属性。
2. dynamic 没有 Vue 众多的 HTML 模板指令，并且不允许在 HTML 字符串插值中使用 JavaScript 表达式，只允许单纯属性。
3. dynamic 的绝大多数 API 都不是声明式的，并且创建实例时传入的参数与 Vue 大相径庭。
4. dynamic 是针对网页应用开发而开发的框架，它在理念上将整个网页视为一个整体；而 Vue 的设计更易于开发弹性的、模块化（组件化）的网站，属于通用框架。

# 开始使用

## 从页面引入脚本

建议将 dynamic 置于所有脚本之前加载。

```html
<script src="path/to/dynamic.js"></script><!--开发-->
<script src="path/to/dynamic.min.js"></script><!--生产-->
```

## 使用打包工具或 TypeScript 开发

克隆仓库或下载仓库，然后在你的代码中导入 `Dynamic`。

```typescript
import Dynamic from "path/to/dynamic.export.ts";
```

注意不要使用 `dynamic.defineGlobal.ts` 而要使用 `dynamic.export.ts`。

## 简介（类比 Vue）

通过使用 dynamic 和 Vue 实现同样的应用来帮助你理解 dynamic 的理念和工作原理。

> **Note** 提示
>
> 由于 dynamic 的设计与 Vue 较相似，下文会将 Vue 和 dynamic 进行**直接类比**。
>
> 此举目的在于通过将 dynamic 类比到 Vue 这个有名且被许多人学习过的框架以帮助你理解和学习 dynamic。**请不要因此对两者进行恶意比较、评判或引发消极讨论**，这里是 `Github`，不是 ~~`weibo`~~。
>
> 如果你对 Vue 不熟悉，那么可以跳过这里去浏览下文的[教程](#教程)。

这是一个 Vue 应用：（请忽视日期处理逻辑中的明显问题）

```html
<div id="app">
    <div :class="class">
        <ul><li v-for="item in list">{{item}}</li></ul>
        <input v-model="inputs" type="text" />
        <p>{{inputs}}</p>
        <button @click="count++">Count: {{count}}</button>
    </div>
    <span>today is: {{date}}</span>
    <button @click="processDate">tomorrow (date: {{date + 1 &lt;= 31 ? date + 1 : 1}})</button>
</div>
```

Vue 实现方式的 JavaScript：（选项式 API，因组合式 API 需要编译且与 dynamic 的设计不太相似）

```javascript
Vue.createApp({
    data(){
        return{
            class: "red",
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
    <div classname>
        <ul>_-items-_</ul>
        <input value="_:inputs:_" type="text" />
        <p>_-inputs-_</p>
        <button onclick="this.data.count++">Count: _-count-_</button>
    </div>
    <span>today is: _-date-_</span>
    <button onclick="processDate(this.data)">tomorrow (date: _-tomorrowDate-_)</button>
    <button onclick="this.method.processDate()">tomorrow (date: _-tomorrowDate-_)</button>
</div>
```

dynamic 实现方式的 JavaScript：

```javascript
const dy = Dynamic.new("#app");
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
dy.addMethods({
    processDate(){
        if(this.date + 1 > 31) this.date = 1;
        else this.date += 1;
    }
});
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
const dy = Dynamic.new(/*Element或css 选择符*/);
```

传入的唯一参数为根节点，根节点**也会**被该实例管理。

现在你可以看看 `dy` 这个实例里暴露了什么东西。

//todo:

# 不要做的事项

## 不要修改 DOM

dynamic **强依赖**于其作用域内 DOM 的不变性，也因此才可以实现弱化 vDOM 的目标。在创建了 dynamic 实例后，修改实例根节点下的任何 DOM 都可能导致不可预料的问题，包括但不限于判断失误、无法正确修改 DOM 内容、DOM 输出放置位置错误等。

例子：

```html
<div id="el">
    <p id="no">paragraph _:export_sth:_</p>
</div>
```

```javascript
var dy = Dynamic.new("#el");
Dynamic.e("#no").innerText = "";
```

将某元素的 `innerText` 设为空字符串将立即移除其内部所有节点，导致 dynamic 无法找到要导出的节点。 

- 一个元素内存在多个相邻文本节点时，在 `chromium` 开发者模式中手动编辑这些文本节点，会触发神奇的东西，只有最后一个文本节点会留下！

## 不要向属性值传入非纯函数







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

不要拒绝阅读源码！dynamic 的源码还不到 500 行，并且其中还有 30% 是非常详细的注释。大多数疑点旁边都会有一个亲切的 `//` 来告诉你这是什么，因为我记不住为什么要这么写🤣。

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





















# ————————旧文档————————

# 复用 HTML

## 关于 `tuID`

`tuID` 是 dynamic 内部识别模板的唯一方式。它是一个长度大于等于 3 个字符的字符串，只能包含小写字母、数字或连字符 `-`，且在不是开头和结尾的字符中有至少一个连字符。

当 dynamic 自动生成 `tuID` 时，其长度总是为 29 字符，并且第 12 个字符总为连字符 `-`，因为 dynamic 的开发者是 LJM**129**14。总共可能生成 4.23e+37 个 `tuID`，基本不用担心碰撞。

此规范的目的是能将每一个 `tuID` 都作为一个有效的自定义元素（[Web Component](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components)）使用。

以下给出正确和错误示例：

```typescript
"p-u" //正确
"qwer-tyuiop" //正确
"multiple-hyphen-element" //正确
"repeated---hyphens" //正确
"ewr-3a" //正确

"q" //错误，字符数太少
"-adadad" //错误，在开头出现连字符
"asdfg" //错误，无连字符

"asdfg-" //错误，在结尾出现连字符（但却是有效的自定义元素，dynamic为了保持标签美观而将其视为错误。）
```

## 注册模板

### 从 `<template>` 元素

dynamic 会默认转换文档中所有的 `<template>` 元素为 dynamic 模板。

如果一个 `<template>` 具有 `dynamic` attribute，那么它将会在变为模板后被 dynamic **从文档中移除**。

如果一个 `<template>` 具有 `nodynamic` attribute，那么它将会被 dynamic 忽略。

如果一个 `<template>` 不具有以上两个 attribute，那么它将会被 dynamic 声明式注册。

- dynamic 会监听DOM变化。运行时释放 `<template>` 元素也会被 dynamic 处理。
- 使用 `tuid` attribute 可自定义 `<template>` 元素被注册为模板时的 `tuID`。无效的 `tuid` attribute 会使 dynamic 自己生成一个。

- 从 `<template>` 元素注册存在弊端：dynamic 缺少对 shadow DOM 的支持，所以所有 `<template>` 元素转换为模板后都会**丢失其 shadow DOM 状态**，其内容被一个顶级 `<div>` 元素包裹。

### 从命令

```typescript
dy.template.register({
    element :Element,
    tuID? :string,
    remove? :boolean
}) :string;
```

|   参数    |              描述              |
| :-------: | :----------------------------: |
| `element` |       要注册为模板的元素       |
|  `tuID`   |      自定义元素的 `tuID`       |
| `remove`  | 是否在注册后从文档中删除该元素 |

使用 `tuID` 参数时，请注意遵循 [`tuID` 格式](#关于 tuID)，否则报错。

该方法返回模板的 ID `tuID`，用于使用该模板。

- 当已存在相同 `tuID` 时，dynamic 不会默默地用新的 `tuID` 代替，而是会直接报错。如果设置了[碰撞检测](#enableAntiClash)，那么 dynamic 会调用 `clashHandler` 方法。

### 特别提示

模板注册时使用了 `Node.cloneNode()` 方法对传入的元素进行拷贝，这会导致该元素及其后代元素的**通过 JavaScript 绑定的事件被完全移除**。在不远的未来可以考虑对此缺陷进行补偿（TODO）。

## 使用模板

在文档的指定位置插入模板：

```typescript
dy.template.render({
    tuID :string,
    element :Element,
    slots? :Record<string, any>,
    removeOuterElement? :boolean,
    insertAfter? :boolean,
    append? :boolean,
    disableDF? :boolean
}) :Nodes[];
```

|         参数         |                             描述                             |
| :------------------: | :----------------------------------------------------------: |
|        `tuID`        |                          模板的 ID                           |
|      `element`       |                         插入目标元素                         |
|       `slots`        |               模板变量，详见[下文](#模板变量)                |
| `removeOuterElement` |      是否将模板最外层的元素（通常是打包用元素）自动删除      |
|    `insertAfter`     | `true`：在目标元素后插入模板；`false`：在目标元素前插入模板  |
|       `append`       | `true`：在目标元素中的最后插入模板；`false`：在目标元素中的最前插入模板；优先级高于`insertAfter` |
|     `disableDF`      | 渲染好的实例会默认被 dynamic 接管，设置该参数为 `true` 以禁用这个行为 |

该方法以节点数组形式返回文档中被插入的模板实例。

或者也可以直接在 HTML 中释放标签名为 `tuID` 的元素，dynamic 会自动将其替换为模板内容。

- dynamic 不会扫描已有的 DOM，释放必须在注册相应模板**后**发生。（TODO：要扫描）

```typescript
dy.e("#myelement").append(document.createElement("my-tuid"));
```

```html
<my-tuid>
    <div>I will be deleted.</div>
    <slot name="a">I'm the value of 'a'</slot>
</my-tuid>
```

- 在这个元素中存在的所有 DOM 都将被删除，全部替换为模板内容。

- 释放带模板变量的模板：参见[模板变量](#模板变量)。

## 插槽

在 dynamic 中，可以通过 `slot` 元素在模板中插入变量，通过 dynamic ，其在功能与原生几乎相同的同时增强了兼容。

- 模板变量不是数据节点，与[数据流管理](#数据流管理)中的数据节点不是同一个概念。模板变量被设计为一次性的替换。
- dynamic 处理模板变量的时机是每一次渲染时，使用 `getContent()` 方法仍可以取到原封不动的传入 DOM。

使用渲染方法：

```html
<template tuid="my-template">
    <div>
        <slot name="slot1" html></slot>
        <p>............<slot name="slot2">default content</slot>.....</p>
    </div>
</template>
```

```typescript
dy.template.render({
    tuID: "my-template",
    element: dy.e("#targetElement"),
    slots: {
        "slot1": "<span style='color: red;'>slot1's red HTML content</span>",
        "slot2": "slot2's content"
    },
    removeOuterElement: true,
    insertAfter: false,
    append: false,
    disableDF: false
});
```

- 为避免 XSS，需要在 `<slot>` 中特别声明 `html` attribute 才能在模板变量中插入 HTML。插入的 HTML 中的 `<slot>` 无论如何都不会被转换，为了使 dynamic 的行为可预知，请**不要嵌套** `slot` **元素**。（TODO：处理嵌套slot）
- 没有 `name` attribute 或没有提供与其 `name` attribute 一致的变量内容的 `<slot>` 会被直接转换为文本节点。所以，`<slot>` 若含有内部内容（如上文的 `#slot2`），则其将成为缺省值，在没有提供该 `<slot>` 的变量值而使用模板时将会使用该值。
- 拥有相同 `name` attribute 的 `<slot>` 在提供了相应 `name` 的值时将共享这一值。
- 当传入的内容为 `undefined`（`typeof undefined`）时，dynamic 会选择性忽略该 `<slot>`。

释放带模板变量的模板：

```html
<!--tuID = my-tuid-->
<my-tuid>
    <slot name="ass">ass</slot>
    <slot name="saa">saa</slot>
</my-tuid>
```

- 不需要注意书写顺序。dynamic 会自动将模板中的变量与元素中赋值的模板变量进行比对并插入。
- 模板中无此 `name` 或不具名的 `<slot>` 将被直接丢弃。
- 当传入的内容为 `undefined` 时，dynamic 不会忽略该 `<slot>`，因为它的类型是 `string`。不可能在 HTML 文本中写出真正的 `undefined` 类型。

## 其他操作

### 更新模板

```typescript
dy.template.update({
    tuID :string,
    element :Element
}) :Element | null;
```

|   参数    |           描述           |
| :-------: | :----------------------: |
|  `tuID`   |        模板的 ID         |
| `element` | 要替换原来模板元素的元素 |

该方法返回旧的模板内容。当不存在相应模板时返回 `null`。

### 删除模板

```typescript
dy.template.delete(tuID :string) :Element | null;
```

|  参数  |   描述    |
| :----: | :-------: |
| `tuID` | 模板的 ID |

该方法返回模板内容。当不存在相应模板时返回 `null`。

### 获取模板内容

```typescript
dy.template.getContent(tuID :string) :Element | null;
```

|  参数  |   描述    |
| :----: | :-------: |
| `tuID` | 模板的 ID |

该方法返回模板内容。当不存在相应模板时返回 `null`。

### 检查一个 `tuID` 是否存在

```typescript
dy.template.existsTUID(tuID :string) :boolean;
```

|  参数  |   描述    |
| :----: | :-------: |
| `tuID` | 模板的 ID |

返回是否在已注册模板中找到了 ID 与传入 `tuID` 相同的模板。

- 该方法完全可以用 [`dy.template.getContent()`](#获取模板内容) 代替，我也觉得没啥用。

### 检查一个模板内容是否存在

```typescript
dy.template.existsElement(element :Element) :string | null;
```

|   参数    |      描述      |
| :-------: | :------------: |
| `element` | 模板的内容元素 |

如果在已注册模板中找到了内容与传入 `element` **等价**（`Node.isEqualNode()`）的模板，则返回该已注册模板的 `tuID`；否则返回 `null`。

- 模板内容不可能与任何节点相同，因为注册时使用了 `cloneNode()` 获得原内容的拷贝。

### 获取所有模板信息

```typescript
dy.template.getTemplates() :object[];
```

该方法返回如下结构的对象：

```json
[
    {
        id: "tuid",
        content: [Element]
    },
    ...
]
```

|   属性    |    描述    |
| :-------: | :--------: |
|   `id`    | 模板的 ID  |
| `content` | 模板的内容 |

### 获取一个模板的实例信息（TODO）

获取指定模板的实例：

```typescript
dy.template.getInstance(tuID :string) :object[];
```

|  参数  |   描述    |
| :----: | :-------: |
| `tuID` | 模板的 ID |

该方法返回如下结构的对象：

```json
[
    {
        reference :Element,
        slots:[
            [slot_name :string] :string,
            ...
        ]
    },
    ...
]
```

|    属性     |                        描述                        |
| :---------: | :------------------------------------------------: |
| `reference` |                     模板的实例                     |
|   `slots`   | 该实例使用的变量，如未赋值则为缺省值或 `undefined` |
| `slot_name` |                       变量名                       |

- 该方法**不能获取**渲染时 `removeOuterElement` 参数为 `true` 的元素，因为其最外层元素已被删除。这时需要使用数据流中的获取作用域然后手动筛选的方案。

# 实例配置（TODO）

在创建实例时传入配置。

```typescript
const dy = new Dynamic(options);
```

下面是对 `options` 对象的有效属性的描述，注意所有属性都是**可选的**。无效的属性将被 dynamic 忽略。

|                   有效属性                    |      类型       |          描述          |
| :-------------------------------------------: | :-------------: | :--------------------: |
| [`renderSecurityLevel`](#renderSecurityLevel) | `0 | 1 | 2 | 3` |   渲染 HTML 安全级别   |
|    [`bannedTagName`](#renderSecurityLevel)    |   `string[]`    |  禁止渲染的 HTML 标签  |
|      [`tInstanceLimit`](#tInstanceLimit)      |    `number`     | 限制模板实例的保存数量 |

## renderSecurityLevel

该参数默认值为 2 。

通过配置该参数来限制 dynamic 渲染危险的 HTML DOM，以免因疏忽大意而造成许多问题。

0. 可渲染任何 DOM（不推荐！）。
1. 禁止渲染 `<script>` 元素。
2. 在 1 级基础上禁止渲染 `<html>` `<body>` `<head>` 元素。
3. 在 2 级基础上禁止渲染一切带有事件绑定 attribute 的元素。

若要自定义禁止渲染的元素**标签**，可以配置 `bannedTagName`，示例：

```json
{"bannedTagName": [
    "style",
    "link"
]}
```

## tInstanceLimit

dynamic 在渲染每一个模板后都会记录有关数据，但是这些数据少有用处，在需要渲染海量模板的页面上还会导致性能下降。这可以通过修改 `tInstanceLimit` 解决，它限制了能同时存在的模板实例的最大值。一旦突破这个值，dynamic 就会删除当前最早的实例记录。设为 0 以完全禁用保存模板实例数据功能。设为 -1（默认值）以取消对模板实例记录数量的限制。



## 可能的 FAQ

#### 为什么要搞直接渲染方法 / 其他工具？
