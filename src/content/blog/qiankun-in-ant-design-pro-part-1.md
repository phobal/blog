---
title: "ant design pro 如何使用 qiankun 做微前端（上）"
description: "在开发环境中使用 qiankun 将 ant design pro 接入微前端。"
pubDate: "2019-11-28"
tags: ["微前端"]
originalUrl: "https://zhuanlan.zhihu.com/p/93198281"
---

> 系列文章，主要分为上下两篇
> 上 - 开发环境的配置
> [下 - 生产环境的配置](https://zhuanlan.zhihu.com/p/94158169)

### **背景**

近 1、2 年微前端在前端圈吵得沸沸扬扬，很多同学都跃跃欲试，当然也包括我。正好公司内部的后台产品需要进行重构，于是就想拿他来试试水。

至于为什么选用微前端来做重构，社区相关的讨论比较多，就不在这里进行具体讨论了，只是说 3 点

- 代码可维护性
之前所有的后台项目都放在一个仓库下面，由不同的项目组一起维护，代码质量不好保证，分支管理也很混乱
- 项目可测试性
由于各项目组的代码都在一个项目下，每一次新增 feature 测试都得对所有功能进行回归测试，工作量随着功能的不断迭代而增加
- 项目可协作性
由于代码放在一起导致多项目组都在开发时引起代码冲突。

而采用微前端的方式可以有效避免以上 三种情况，首先各个项目组可以有自己单独的仓库来管理代码，在代码层面上是完全分离的，不会出现质量不一致，质量问题可以由项目组内部协商解决，分支也是由自己来管理。其次开发 feature 测试只需要测试新开发的功能，而不用对其他项目的功能进行测试。最后一个问题当然也不会出现了。

### **技术栈**

公司大部分后台产品对于 UI 没太多个性化需求，所以在技术选型上采用了 ant design 设计风格，配套 [um](https://umijs.org/)i，外加 [ant design pro](https://pro.ant.design/docs/getting-started-cn) 加持，开发中后台业务可谓是信手拈来，代码写起来行云流水般畅快。总结下来使用了如下工具：

- umi
- ant design pro

经过调研目前市面上已有的微前端方案，主要以下 6 种：

1. 使用 HTTP 服务器(多为 nginx)的路由来重定向多个应用
2. 在不同的框架之上设计通讯、加载机制，诸如 [Mooa](https://github.com/phodal/mooa) 和 [Single-SPA](https://github.com/CanopyTax/single-spa)
3. 通过组合多个独立应用、组件来构建一个单体应用
4. iFrame。使用 iFrame 及自定义消息传递机制
5. 使用纯 Web Components 构建应用
6. 结合 Web Components 构建

结合公司现有技术栈来看，阿里开源的 [qiankun](https://github.com/umijs/qiankun) 方案比较适合我们，该方案基于 Single-SPA 实现，外加少许 HTTP 服务器路由重定向。

### **接入过程**

为了简化 umi 项目的配置，`qiankun` 项目组开源了一款 umi 插件` @umijs/plugin-qiankun`，所以在正式接入 `qiankun` 之前我们要准备以下工作：

1. 手头上至少有一个基于 `ant design pro` 项目
2. 准备一个入口项目，作用是作为子系统的入口

> 下面统一一下叫法，anr-design-pro 项目称为子项目。入口项目称为主项目

### **先来接入子项目**

1. 为子项目安装 qiankun 插件 @umijs/plugin-qiankun

```
yarn add @umijs/plugin-qiankun
```

2. 在 config/config.js 中加入插件

```
const plugins = [
 ... // 其它插件
  ['@umijs/plugin-qiankun', { slave: {} }],
]
```

3. 修改 `app1/src/pages/document.ejs` 的 `<div id="root"></div>` 为 `<div id="<%= context.config.mountElementId %>">`

4. 在根目录下的 `.env` 中指定项目启动端口号 `PORT=8000`. 这里的端口号定义一个本地未被占用的就行

### **在主项目中注册子项目**

需要提供一个入口项目，主要目的是 **导航路由 + 资源加载框架**

假设你已经有一个入口项目，接下来需要做的工作如下：

1. 为主项目安装 `qiankun` 插件 `@umijs/plugin-qiankun`
`yarn add @umijs/plugin-qiankun`
2. 在 `umi` 的配置文件中添加插件、配置文件通常为 `.umirc`或者 `config.js`

```
const plugins = [
  ...  // 其它插件
  ['@umijs/plugin-qiankun', 
   {
     master:
      {
          defer: true,  // 是否异步渲染
          jsSandbox: true,  // 是否启用 js 沙箱
          prefetch: true  // 是否启用 prefetch 特性
      }
   }
  ],
]
```

3. 注册子应用

可以有两种方式注册子应用，构建时 和 运行时

- 构建时

```
export default {
  plugins: [
    [
      '@umijs/plugin-qiankun',
      {
        master: {
          // 注册子应用信息
          apps: [
            {
              name: 'app1', // 唯一 id
              entry: '//localhost:7001', // html entry
              base: '/app1', // app1 的路由前缀，通过这个前缀判断是否要启动该应用，通常跟子应用的 base 保持一致
              history: 'browser', // 子应用的 history 配置，默认为当前主应用 history 配置
            },
            {
              name: 'app2',
              entry: {
                // TODO 支持 config entry
                scripts: [],
                styles: [],
              },
              base: '/app2',
            },
          ],
          jsSandbox: true, // 是否启用 js 沙箱，默认为 false
          prefetch: true, // 是否启用 prefetch 特性，默认为 true
        },
      },
    ],
  ],
};
```

- 运行时

```
export default {
  plugins: [
    ['@umijs/plugin-qiankun', { master: {} }]
};
```

在 src/app.js 中配置，export qiankun

```
// 值是一个 promise
export const qiankun = fetch('/config').then(() => ({
  // 注册子应用信息
  apps: [
    {
      name: 'app1', // 唯一 id
      entry: '//localhost:7001', // html entry
      base: '/app1', // app1 的路由前缀，通过这个前缀判断是否要启动该应用，通常跟子应用的 base 保持一致
      history: 'browser', // 子应用的 history 配置，默认为当前主应用 history 配置
    },
    {
      name: 'app2',
      entry: {
        // TODO 支持 config entry
        scripts: [],
        styles: [],
      },
      base: '/app2',
    },
  ],
  jsSandbox: true, // 是否启用 js 沙箱，默认为 false
  prefetch: true, // 是否启用 prefetch 特性，默认为 true
  lifeCycles: {
    // see https://github.com/umijs/qiankun#registermicroapps
    afterMount: props => {
      console.log(props);
    },
  },
  // ...even more options qiankun start() supported, see https://github.com/umijs/qiankun#start
}));
```

至此所有的配置结束，如果顺利的话应该就能看到效果了

示例可以参考这个：[https://github.com/phobal/antd-pro-microfe](https://github.com/phobal/antd-pro-microfe)

**常见问题**

1. `AssertionError [ERR_ASSERTION]: Document src/pages/document.ejs must contain <div id="root-slave">`

![文章配图](/images/zhihu/93198281-1.png)

这个是在 config.js 中配置了 `mountElementId`,  该配置的作用是指定应用被加载到哪个 dom 节点上的，插件默认是 `slave-root`, 而 `ant-design-pro` 默认的是 `root`, 所以在  `src/pages/document.ejs` 中将 id 修改为 config.js 中的 `mountElementId` 即可，推荐使用下面的方法

`<div id="<%= context.config.mountElementId %>">`

这样在 `mountElementId`被修改的时候可以确保 ejs 中存在该 dom 节点

2. 页面空白或者一直 loading

![文章配图](/images/zhihu/93198281-2.png)

报这个错的主要原因是打包的时候找不到端口，需要手动指定一下端口，两种方式

- `PORT=8002 yarn start   端口随意
- 在根目录下新建一个 `.env` 的文件，里面写入端口

```
PORT=8002
```

3. index.js:184 Uncaught app1: Application 'app1' died in status LOADING_SOURCE_CODE: You need to export the functional lifecycles in app1 entry

![文章配图](/images/zhihu/93198281-3.png)

出现以上情况，主要的原因是未在项目的入口处未导出生命周期方法，两种方法可以解决

- 在子项目入口处导出生命周期方法
- 修改项目的 name , 添加 `${name}-umi`,比如项目名称叫 `app1`,那么将名称改为 `app1-umi` 就可以了

[上  完]
