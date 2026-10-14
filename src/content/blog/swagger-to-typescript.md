---
title: "swagger 转 typescript 的一些思考"
description: "围绕 Swagger 到 TypeScript 的类型生成，整理实践中的问题和思考。"
pubDate: "2022-05-26"
tags: ["TypeScript"]
originalUrl: "https://github.com/phobal/blog/issues/3"
---

## 前言

在日常业务开发过程中，通常是后端会定义好接口，然后输出为 swagger 文档，前端照着后端给的文档进行检查，看有没有少接口、少字段，没啥问题后开始在前端代码中建 Model。
![Untitled](/images/legacy/issue-3-1.png)


转成前端 Model
![Untitled](/images/legacy/issue-3-2.png)



这个过程非常的耗时，需要不停的复制粘贴，尤其是字段比较多的时候简直崩溃。

仔细想想实际上就是把后端（Java）定义的类型翻译为 TypeScript 的类型，既然只是类型的转换，那么能不能通过工具自动帮我去做这层转换呢？带着这个想法开始去 Google 上搜索，还别说，出来的结果还挺多，

![Untitled](/images/legacy/issue-3-3.png)


## 现有方案分析

在看现有方案前，先了解下 swagger-ui 的生成原理

后端按照 openapi 的规范写好代码 → 生成 swagger 定义文件 swagger.json → 经过渲染成 html 供在浏览器查看

这其中最重要的就是 swagger.json 文件，这个文件包含了所有的接口信息，

参考示例网站：[https://petstore.swagger.io/](https://petstore.swagger.io/)

swagger.json 参考：[https://petstore.swagger.io/v2/swagger.json](https://petstore.swagger.io/v2/swagger.json)

![Untitled](/images/legacy/issue-3-4.png)


其中最主要的信息就是 paths,  这个对象的 key 就是接口 url 的路径，

![Untitled](/images/legacy/issue-3-5.png)


展开后，可以看到 第一个 key 就是 http 的 method（比如上图的 post）,展开 method 后里面包含了常用的参数（parameters）,返回结果（response）等。

能拿到这些结构化的信息那么处理起来就比较方便了。目前主流的方案都是基于这份 json 文件做文章。只是展现的形式不同罢了。

目前主流的做法有 2 种

- 直接运行脚本，生成代码
- vscode 插件

### 直接运行脚本，生成代码

比较有代表性的有：

- https://github.com/drwpow/openapi-typescript 直接通过命令行生成 ts 文件
    - 优点：使用简单，只需要一条命令就可以生成
    - 缺点：
        - 生成的代码比较乱，所有生成的接口定义都放在同一个文件下，可阅读性几乎为 0
        - 命名也不是很好，达不到项目使用标准
- https://github.com/chenshuai2144/openapi2typescript 通过配置文件生成 ts 文件
    - 优点：
        - 弥补了上面工具的缺点，针对不同分类生成不同的文件，代码也清晰很多
        - 支持生成 service 层代码，免去自己去写，还可以自定义 request，挺方便的
    - 缺点
        - 所有生成的 model 定义还是在一个文件中，不太好找
        - 命名也不是很好，达不到项目使用标准

### vscode 插件

- https://github.com/lanten/swagger-to-types 在 vscode 中查看 ts 定义

![Untitled](/images/legacy/issue-3-6.png)


- 优点
    - 使用方便，只需要配置一个地址就可以查看，生成的文件也是按照功能作用来进行分类的，比较清晰
    - 对项目代码没有侵入性，不会存在记录
- 缺点
    - 兼容性不是很好，目前在我这里还没使用成功。
    

### 总结

对于以上两种我可能更喜欢第二种方式 vscode 插件的形式。

上面几种方案中都存在一个问题，生成的代码很难直接用在生产中，因为生成的 type 命名都比较奇怪，没有什么可读性，所以不能直接将生成的代码拿来用，只能拿他们来作为辅助，可以在生成的代码基础上进行修改，但是这里又存在一个问题，假如我们在 v1.0 版本中将生成的代码做了修改，在 v1.1 版本中我们再执行脚本生成代码，就会将我们之前修改的代码给覆盖掉了，这点肯定不能接受的。

所以最好使用一些对原项目无侵入的形式来做比较好。

基于此，我想到了一个可能更优雅的方式 —— Chrome 插件、

先看下效果：

![Untitled](/images/legacy/issue-3-7.png)


在 swagger-ui 网站中，对每个 url 后面插入一个 TS 按钮，只需要点几下 TS 按钮就会出现一个弹窗，将这个接口涉及到的 url、method、parameters、response 都定义好了，点击右上角的复制按钮就可以将这份代码复制了。这样对代码侵入性为 0，同时也能很好的提高效率。

当然这种方式也存在一些问题：

- 命名不是特别准确、规范，需要二次调整

目前这个插件还在团队内部试用，等试用一段时间 bug 比较少了再考虑开源出来。
