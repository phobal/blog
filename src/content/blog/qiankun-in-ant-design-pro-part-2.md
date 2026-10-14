---
title: "ant design pro 如何使用 qiankun 做微前端（下）"
description: "在生产环境中配置 ant design pro 与 qiankun 微前端方案。"
pubDate: "2019-11-28"
tags: ["微前端"]
originalUrl: "https://zhuanlan.zhihu.com/p/94158169"
---

> 系列文章，主要分为上下两篇
> [上 - 开发环境的配置](https://zhuanlan.zhihu.com/p/93198281)
> 下 - 生产环境的配置

[上篇](https://zhuanlan.zhihu.com/p/93198281)讲到了开发环境的配置，不知道大家在本地是否 run 起来了，如果在配置的过程中遇到什么问题，欢迎在评论区留言，大家一起探讨。接下来讲一下在生产环境怎么来配置。因为会涉及到反向代理，所以在看这篇文章前需要你对 nginx 有一定的了解。

在正式上生产环境之前解决一下数据接口的问题，在上一篇文章开发环境中我们使用的是 umi 提供的 mock 服务功能，在生产环境就不能这么用了。接下来先看看开发环境中怎么接入真实的后端接口服务？

### **模拟后端**

在没有后端真实服务的情况下，我们可以采用一些第三方 mock 平台，比如：[easy-mock](https://github.com/easy-mock/easy-mock/) (PS： 目前官方服务证书失效，无法正常提供服务，建议使用[社区热心小伙伴搭建的服务](https://easy-mock.bookset.io/))， 使用说明这里不详细说了。

![文章配图](/images/zhihu/94158169-1.png)

这里的后端服务地址为： [https://easy-mock.bookset.io/mock/5dc1032e9e606017b5d2c92d](https://easy-mock.bookset.io/mock/5dc1032e9e606017b5d2c92d)

### **开发环境接入模拟后端**

Umi 的配置项中提供了一个 proxy 属性，该属性起到代理的作用，可以将前端请求 api 代理到正确的后端服务。在 antd pro 项目中通常会在真实的后端接口地址上加一个前缀 `/api` 来标识为后端接口。

子项目 App1 的前缀配置成 `/api-app1`

```
// app1/config/config.ts`
export default {
  proxy: {
    '/api-app1': {
      target: 'https://easy-mock.bookset.io/mock/5dc1032e9e606017b5d2c92d',
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/api-app1/, '')
    }
  },
}
```

主项目 portal 的前缀配置成 `/api`

```
// portal/.umirc.js
export default {
  proxy: {
    '/api': {
      target: 'https://easy-mock.bookset.io/mock/5dc1032e9e606017b5d2c92d',
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/api/, '')
    }
  }
} 
```

通过以上的配置，在启动命令中把 mock 给关闭掉 `MOCK=none umi dev`, 重启服务这时页面拿到的数据就是从 easy-mock 拿到额数据了。

### **子系统打包生产环境**

在打包前需要检查一下子系统如下配置是否正确配置

`publicPath` 为所有的资源指定一个基础路径，这里我们设置为系统名称 `/app1/`

`outputPath` 指定打包路径，这里我们把设置为 `dist + 系统名称`如： `dist/app1`

接下来执行 `yarn build` 进行打包，app1 的打包结构如下：

```
dist
|____app1
| |____vendors.11d9cecf.chunk.css
| |____umi.11ef8083.css
| |____5.749ef7b5.async.js
| |____4.2710db63.async.js
| |____index.html
| |____vendors.9ea14de5.async.js
| |____3.daeb3d78.chunk.css
| |____1.f088ce2b.async.js
| |____3.725c1c63.async.js
| |____asset-manifest.json
| |____7.c0a3e86c.async.js
| |____8.3e21717a.async.js
| |____favicon.png
| |____icons
| | |____icon-192x192.png
| | |____icon-512x512.png
| | |____icon-128x128.png
| |____6.b5f5c35a.async.js
| |____5.42a408ef.chunk.css
| |____4.dc2bcaf8.chunk.css
| |____umi.f38ea7e4.js
| |____7.c09cf642.chunk.css
```

cd 到 dist 目录下，执行 `pwd`. 查看当前文件夹在系统中的绝对位置, 比如我的地址是 `/Users/phobal/Documents/demo/antd-pro-microfe/app1/dist`, 记下它，在后面 nginx 配置中会使用到

![文章配图](/images/zhihu/94158169-2.png)

### **子系统 nginx 配置**

找到 nginx 的位置，mac 系统默认安装路径在 `/usr/local/etc/nginx` 下， 在 nginx.conf 中添加 http 配置下添加 server

```
server {
  listen  5002;
  root  /Users/phobal/Documents/demo/antd-pro-microfe/app1/dist; # 子项目打包地址
  index index.html;
  # 开启跨域
  add_header Access-Control-Allow-Origin *;
  add_header Access-Control-Allow-Headers X-Requested-With;
  add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
  location / {
    try_files $uri  /app1/index.html;  # 注意这里的 try_files。 默认是 /index.html
  }
  location /api-app1/ {
    rewrite ^/api-app1/(.*)$ /$1 break;
    proxy_pass https://easy-mock.bookset.io/mock/5dc1032e9e606017b5d2c92d/$1$is_args$args;
  }
}
```

### **主系统打包生产环境**

在 portal 项目下执行打包命令

`yarn build`

打包后的文件结构如下

```
dist
|____vendors.async.js
|____index.html
|____1.chunk.css
|____umi.js
|____.gitkeep
|____0.chunk.css
|____1.async.js
|____0.async.js
|____umi.css
|____vendors.chunk.css
```

cd 到 dist 目录下，执行 `pwd`. 查看当前文件夹在系统中的绝对位置, 比如我的地址是 /Users/phobal/Documents/demo/antd-pro-microfe/portal/dist`, 记下它，在后面 nginx 配置中会使用到

**主系统 nginx 配置**

```
server {
  listen  5013;
  root  /Users/phobal/Documents/demo/antd-pro-microfe/portal/dist;
  index index.html;
  location / {
    try_files $uri  /index.html;
  }
  location /api {
    rewrite ^/api/(.*)$ /$1 break;
    proxy_pass https://easy-mock.bookset.io/mock/5dc1032e9e606017b5d2c92d/$1$is_args$args;
  }
  # 代理子应用
  location /app1/ {
    proxy_pass http://127.0.0.1:5012; # 子应用的地址
  }
}
```

如果顺利的话在浏览器中访问 [http://127.0.0.1:5013](http://127.0.0.1:5013/) 看到效果了。

大家如果在配置的过程中遇到什么问题欢迎在评论区留言讨论。

【完】
