简体中文 | [English](README.en.md)

# dynamic

又叫 `dynamicJS`、`dnJS`，一个简单的前端框架，用于构建用户界面。

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



# API 指引 todo:

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

# 补充说明

## 学习 dynamic

可以前往 [`tests/`](tests) 和 [`sample_projects/`](sample_projects) 目录浏览其中的示例项目。其中包括了一些简单的项目和在本文中提到的各种项目的实际实现。

不要拒绝阅读源码！dynamic 的源码还不到 `<待更新>` 行，并且其中还有 30% 是非常详细的注释。大多数疑点旁边都会有一个亲切的 `//` 来告诉你这是什么，因为我记不住为什么要这么写🤣。

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

- 欢迎提出 issue，但请保持冷静的态度和对事不对人的基本道德准则。
- 请不要在未与我沟通的情况下发起 Pull Request。
- 随便 fork。
