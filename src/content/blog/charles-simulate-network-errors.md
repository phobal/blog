---
title: "利用 Charles 模拟网络异常"
description: "使用 Charles 的 Rewrite 功能模拟 HTTP 请求异常，便于本地调试错误处理。"
pubDate: "2021-01-11"
tags: ["工具", "前端"]
originalUrl: "https://zhuanlan.zhihu.com/p/343491275"
---

### 前言

在写业务代码的时候经常遇到需要对 request 请求异常的情况进行处理，比如：

* 处理 http status 非 200 情况下

* 处理无权限 403 的情况

* 处理 404 的情况

* 处理数据异常

遇到需要处理这些的时候很多同学第一想到的是让后端同学帮忙模拟一下这些异常的情况，当然这是一个方法，但是每次都得去麻烦他们，你觉得麻烦，他们更觉得麻烦。

那有没有办法让我们自己就可以在本地模拟这些异常情况呢？当然有了，这个就是今天要讲的抓包神器 [Charles](https://www.charlesproxy.com/download/)

### 示例

下面以 **处理无权限 403 的情况** 作为示例来演示如何利用 Charles 抓包并篡改 response（这里距离为 web 端的抓包，而不是手机端抓包）

* 打开 Charles， 启动 macOS Proxy

![文章配图](/images/zhihu/343491275-1.png)

* 刷新页面，在 Charles 左侧列表中找到你关注的接口，比如这个接口：[http://localhost.charlesproxy.com:9091/account/tendermgt](http://localhost.charlesproxy.com:9091/account/tendermgt)

![文章配图](/images/zhihu/343491275-2.png)

**注意**：如果你需要抓取 localhost 的接口数据，默认情况下 Charles 是不支持，你需要这么来处理才能正确抓取到 Charles 包

需要在把 location 作为 charles 的二级域名，比如本地服务为： [http://localhost:9091](http://localhost:9091/), 把它改为： [http://localhost.charlesproxy.com:9091](http://localhost.charlesproxy.com:9091/) 就可以了。

* 修改 response

找到顶部菜单栏 [Tools] -> [Rewrite]

![文章配图](/images/zhihu/343491275-3.png)

① 新建一个 rewrite 规则

② 随便取个名字，比如：test

③ 复制需要改写的接口地址到 Host 输入框中，其他输入框会自动填充

④ 保存

![文章配图](/images/zhihu/343491275-4.png)

① 添加规则

② 下拉框选择 “Response Status”

③ 被改写的状态码，这里为 200

④ 改写后的状态码，这里为 403

* 现在再刷新页面，观察控制台，不会意外的话，你需要改写的接口已经变为 403 了

### 总结

Charles 不仅仅可以修改 Response 的 Status, 还可以做很多，比如：

* Add Header, 添加请求头

* Modifier Header， 修改请求头

* Remove Header， 删除请求头

* Host， 修改 Host

* Path， 修改域名

* URL： 修改路径

* Add Query Params 添加参数

* Modifier Query Params 修改参数

* Remove Query Params 删除参数

* Body 修改 Body

同样也可以对 Request 进行修改。

Charles 是一款非常优秀的抓包工具，广泛应用于移动端开发中，在 PC 端也有很多应用场景，熟悉这类抓包工具对日常开发可以起到提高开发效率的作用。

更多 Charles 的用法参考以下链接：

- [Welcome • Charles Web Debugging Proxy](https://www.charlesproxy.com/documentation/)

* [Charles 功能介绍和使用教程](https://juejin.cn/post/6844903665304600589)
