---
title: "从 0 开始发布一个 react 组件到 npm"
description: "从组件开发到构建、测试与发布，记录 React 组件发布到 npm 的过程。"
pubDate: "2022-05-24"
tags: ["React", "npm"]
originalUrl: "https://github.com/phobal/blog/issues/2"
---

> 本文首发于 2017 年 10 月 2 日，平台为知乎，地址：https://zhuanlan.zhihu.com/p/37366401

> 翻译自： [A guide to building a React component with Webpack 4, publishing to npm, with a demo on GitHub…](https://link.zhihu.com/?target=https%3A//medium.com/dailyjs/building-a-react-component-with-webpack-publish-to-npm-deploy-to-github-guide-6927f60b3220)

当你开发完一个 React 组件后也许你想过把它贡献给社区，但是你又不知道如何让其他人能使用，这篇文章将指导你完成这个目标  

假设你是通过 create-react-app 创建的项目，然后你要发布的组件是包含在你项目中的，要发布该组件的话可能需要对你的工作流做一些特殊的处理  

在这个教程中包含了从项目搭建到发布整个过程，在开始前你最好先了解一下 react-scripts,这样的话你才能更好的理解我讲的

主要目标包括：

* 在本地创建一个 demo , 通过 webpack4 的配置实现文件改变后页面自动刷新
* 将编译后的组件发布到 npm 上去，用户直接可以使用
* 在 GitHub Pages 上发布一个可以在线预览的 Demo

### 创建组件和DEMO

创建项目文件夹并初始化 npm package ，确保你创建的组件名称没有在 [npm](https%3A//www.npmjs.com/) 上被使用过， 这里我们用 my-component作为示例

``` bash
$ mkdir my-component
$ cd my-component
$ npm init
```

运行 npm init 问题提示列表可以采用默认的选项 （译者注：默认配置可以使用 npm init -y）

对于本地 demo 组件我们需要 react，所以接下来我们安装 react 到我们项目开发依赖中来， 后面我会介绍怎样让用户知道我们发布的组件有需要 react 依赖

``` bash
npm i react react-dom -D
```
我们的项目将通过 webpack进行构建， Babel 进行编译，webpack-dev-server 作为本地开发服务器，接下来我们将他们添加到项目的开发依赖中去

``` bash
npm i webpack webpack-cli webpack-dev-server html-webpack-plugin style-loader css-loader babel-core babel-loader babel-preset-env babel-preset-react -D
```
这时上面安装的依赖已经被添加到根目录下的 package.json中了，接下来我们添加一个 start的脚本，用于启动我们本地开发的服务器， start如下：

``` diff
{
 "name": "my-component",
 "version": "1.0.0",
 "description": "",
 "main": "index.js",
 "scripts": {
   "test": "echo \"Error: no test specified\" && exit 1",
+   "start": "webpack-dev-server --mode development"
 },
 "author": "",
 "license": "ISC",
 "devDependencies": {
 "babel-core": "^6.26.3",
 "babel-loader": "^7.1.4",
 "babel-preset-env": "^1.7.0",
 "babel-preset-react": "^6.24.1",
 "css-loader": "^0.28.11",
 "html-webpack-plugin": "^3.2.0",
 "react": "^16.4.0",
 "react-dom": "^16.4.0",
 "style-loader": "^0.21.0",
 "webpack": "^4.9.1",
 "webpack-cli": "^2.1.4",
 "webpack-dev-server": "^3.1.4"
 }
}
```
现在让在我们的项目中创建组件和示例代码目录，目录树结构如下
``` tree
├── example // 示例代码存放目录
 │  └── src
├── node_modules
├── package.json
└── src // 组件源代码和样式存放目录
```
下面我将创建一个非常简单的组件以作为示例
``` tsx
/*** src/index.js  ***/
import React from 'react';
import './styles.css';
const MyComponent = () => (
 <h1>Hello from My Component</h1>
);
export default MyComponent;
```

``` css
/*** src/styles.css ***/
h1 {
 color: red;
}
```
( 社区一定会爱上它的

接下来添加一个 demo

``` html
<!-- examples/src/index.html -->
<html>
<head>
 <title>My Component Demo</title>
 <meta charset="utf-8">
 <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
</head>
<body>
 <noscript>
 You need to enable JavaScript to run this app.
 </noscript>
 <div id="root"></div>
</body>
</html>

```
``` jsx
/*** examples/src/index.js ***/
import React from 'react';
import { render} from 'react-dom';
import MyComponent from '../../src';
const App = () => (
 <MyComponent />
);
render(<App />, document.getElementById("root"));
```
注意 demo 中的 MyComponent 是从 ../../src中导入的

接下来配置 webpack, 在项目根路径下创建 webpack.config.js文件

``` js
/*** webpack.config.js ***/
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
 template: path.join(__dirname, "examples/src/index.html"),
 filename: "./index.html"
});
module.exports = {
 entry: path.join(__dirname, "examples/src/index.js"),
 module: {
   rules: [{
     test: /\.(js|jsx)$/,
   use: "babel-loader",
   exclude: /node_modules/
 },{
   test: /\.css$/,
   use: ["style-loader", "css-loader"]
 }]
},
 plugins: [htmlWebpackPlugin],
 resolve: {
   extensions: [".js", ".jsx"]
 },
 devServer: {
   port: 3001
}};
```
Webpack 的配置文件主要做了如下事情：

* 使用 example/src/index.js作为项目入口，处理资源文件的依赖关系
* 通过 babel-loader来编译处理 js和jsx文件
* 通过style-loader 和 css-loader来处理 css 依赖和注入内联样式
* 通过html-webpack-plugin自动注入编译打包好的脚本文件
* 为 demo 启动端口为 3001 的服务

最后需要指定 Babel 需要对哪些文件进行编译，毫无疑问 React 中使用的 JSX 文件需要被编译，让它转换成被主流浏览器都支持的 ES5 ,通用的配置也很简单，只需要添加一对 presets,在项目根目录下添加文件.babelrc

``` json
{
 "presets": ["env", "react"]
}
```
接下来运行 demo

``` bash
$ npm start
```
启动完成后打开浏览器输入 [http://localhost:3001](https://link.zhihu.com/?target=http%3A//localhost%3A3001/)，你将会在页面上看到你写的组件，你可以修改你的代码并保存，页面将会自动刷新，我们的开发环境已经处于监控模式

接下来继续完成第二项目标

### 发布用户能直接使用的组件到 npm 上

发布到 npm 是一个很简单自动化的工作，只是在发布前需要做如下工作  
我们要发布被 babel 编译且被压缩后的版本，要让没有使用 babel 的项目也能够正常的使用，比如不能出现 JSX 语法  
首先需要安装 babel cli
``` bash
$ npm i babel-cli -D
```
现在我们添加 transpile脚本，以便使用 Babel 编译我们的源代码，同时拷贝一些静态文件(如：css 文件)到目标打包目录dist下  
同时指定被编译后的版本为组件的主入口，更改后的 package.json如下

``` json
{
 "name": "my-component",
 "version": "1.0.0",
 "description": "",
 "main": "dist/index.js",
 "scripts": {
   "test": "echo \"Error: no test specified\" && exit 1",
   "start": "webpack-dev-server --mode development",
   "transpile": "babel src -d dist --copy-files"
 },
 "author": "",
 "license": "ISC",
 "devDependencies": {
   "babel-cli": "^6.26.0",
   "babel-core": "^6.26.0",
   "babel-loader": "^7.1.4",
   "babel-preset-env": "^1.6.1",
   "babel-preset-react": "^6.24.1",
   "css-loader": "^0.28.11",
   "html-webpack-plugin": "^3.2.0",
   "react": "^16.3.2",
   "react-dom": "^16.3.2",
   "style-loader": "^0.20.3",
   "webpack": "^4.5.0",
   "webpack-cli": "^2.0.14",
   "webpack-dev-server": "^3.1.3"
 }
}
```
### 尝试编译
``` bash
npm run transpile
```
现在在我们项目根目录下面会有一个 dist 目录，包含了 index.js 的编译版本，和拷贝的样式文件styles.css,这些文件是用户可以直接 可以import到他们项目的文件，接下来我们再在我们的工作流中添加一个脚本prepublishOnly ,这个脚本会在每次我们需要发布我们的组件到 npm上去的时候会自动执行，他能确保我们每次发布上去的代码都是最新代码编译的

另外我们需要告诉用户在用户我们的组件的时候对于 React 版本的要求，peerDependency 能够很好的表达这个信息，同时在我们的发布的组件包中不会包含 react , 这样也减小了包的大小，更加重要是可以避免在用户的项目中存在多个 react 版本，更改后的 package.json如下

``` json
{
 "name": "my-component",
 "version": "1.0.0",
 "description": "",
 "main": "dist/index.js",
 "scripts": {
   "test": "echo \"Error: no test specified\" && exit 1",
   "start": "webpack-dev-server --mode development",
   "transpile": "babel src -d dist",
   "prepublishOnly": "npm run transpile"
 },
 "author": "",
 "license": "ISC",
 "peerDependencies": {
   "react": "^16.3.0",
   "react-dom": "^16.3.0"
 },
 "devDependencies": {
   "babel-cli": "^6.26.0",
   "babel-core": "^6.26.0",
   "babel-loader": "^7.1.4",
   "babel-preset-env": "^1.6.1",
   "babel-preset-react": "^6.24.1",
   "css-loader": "^0.28.11",
   "html-webpack-plugin": "^3.2.0",
   "react": "^16.3.1",
   "react-dom": "^16.3.1",
   "style-loader": "^0.20.3",
   "webpack": "^4.5.0",
   "webpack-cli": "^2.0.14",
   "webpack-dev-server": "^3.1.3"
 }
}
```
最后让我们在项目的根目录下添加.npmignore文件，告诉 npm，我们项目中哪些文件和文件夹是在发布的包中被忽略掉的

``` shell
# .npmignore 
src
examples
.babelrc
.gitignore
webpack.config.js
```
发布我们的组件到 npm 上
```
npm publish
```
接下来让我们完成最后一项目标

### 在 GitHub Pages 上发布一个在线 demo

在 GitHub Pages 托管在线 Demo 是免费的，需要使用 webpack 来构建我们的生产环境版本，然后发布到 GitHub 仓库指定的分支上去，接下来让我们自动化完成这些吧！

首先，我们需要借助一个帮助维护特性分支的包，我们还没有对我们的项目添加 git 代码版本控制，稍等片刻
``` bash
$ npm i gh-pages -D
```
然后在 package.json 中添加三个脚本

``` diff
{
 "name": "my-component",
 "version": "1.0.0",
 "description": "",
 "main": "dist/index.js",
 "scripts": {
   "test": "echo \"Error: no test specified\" && exit 1",
   "start": "webpack-dev-server --mode development",
   "transpile": "babel src -d dist --copy-files",
   "prepublishOnly": "npm run transpile",
+   "build": "webpack --mode production",
+  "deploy": "gh-pages -d examples/dist",
+  "publish-demo": "npm run build && npm run deploy"
 },
 "author": "",
 "license": "ISC",
 "peerDependencies": {
   "react": "^16.3.0",
   "react-dom": "^16.3.0"
 },
 "devDependencies": {
   "babel-cli": "^6.26.0",
   "babel-core": "^6.26.0",
   "babel-loader": "^7.1.4",
   "babel-preset-env": "^1.6.1",
   "babel-preset-react": "^6.24.1",
   "css-loader": "^0.28.11",
   "gh-pages": "^1.1.0",
   "html-webpack-plugin": "^3.2.0",
   "react": "^16.3.2",
   "react-dom": "^16.3.2",
   "style-loader": "^0.20.3",
   "webpack": "^4.5.0",
   "webpack-cli": "^2.0.14",
   "webpack-dev-server": "^3.1.3"
 }
}
```
build 脚本目的是用 webpack 帮我们构建一个 boundled, 和压缩生产环境代码，这里我们需要告诉 webpack 哪个文件是我们项目输出的结果

``` js
/*** webpack.config.js ***/
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
 template: path.join(__dirname, "examples/src/index.html"),
 filename: "./index.html"
});
module.exports = {
 entry: path.join(__dirname, "examples/src/index.js"),
 output: {
   path: path.join(__dirname, "examples/dist"),
   filename: "bundle.js"
 },
 module: {
   rules: [{
     test: /\.(js|jsx)$/,
     use: "babel-loader",
     exclude: /node_modules/
   },{
     test: /\.css$/,
     use: ["style-loader", "css-loader"]
   }]
 },
 plugins: [htmlWebpackPlugin],
 resolve: {
   extensions: [".js", ".jsx"]
 },
 devServer: {
   port: 3001
 }
};

```
来，试一试
``` bash
$ npm run build
```
你会发现生成版本的代码已经打包到了 examples/dist

现在来对项目添加 git 版本控制，在项目的根目录下添加 .gitignore文件，需要对一些中间过程代码文件进行排除

``` bash
# .gitignore
node_modules
dist
```

接着去 GitHub 为它创建一个仓库，按照随后屏幕上出现的提示执行命令行 ...or create a new respository on the command line，将会在本地初始化一个本地仓库，并连接到远程仓库上

现在我们的本地和远程的仓库都已经创建并连接上了，准备将 demo 发布到托管环境了，这时，首先需要去这个项目的仓库中为它新建一个 gh-pages 的分支，deploy 脚本就是为了帮我们干这个事的

``` bash
npm run deploy
```
点击设置连接到你的 github 仓库页面，然后滚动到 github pages 栏目，你将会看到你的 demo 在线连接地址，恭喜你 上线了！

最后我们使用 publish-demo脚本叫 build 和 deploy 脚本合并在一起简化我们的工作流

``` bash
npm run publish-demo
```
### 后话

后面当你需要发布一个新的版本时，你只需要更新一下 package.json 里面的 version 版本号，然后执行 npm publish 和 npm run publish-demo,发布新版本到 npm 是分分钟的事儿，发布新的 demo 到 GitHub Pages 最多也只需要 20分钟

当然你想让你的组件能在社区被发现，你还需要做一些其他事情，由于文章篇幅有限，这里就不展开讲了，就简单列举一下吧

添加 README.md ,描述你的组件是做什么的，在线 demo 的链接，使用示例，以及组件 API
添加自动化测试
在 package.json 中填充 description 和 repository字段
考虑给你的组件添加许可

感谢你的阅读！
