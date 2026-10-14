---
title: "使用 Maptable 对自习室进行数据分析"
description: "使用 Maptable 分析自习室数据的过程与发现。"
pubDate: "2023-03-29"
tags: ["数据分析"]
originalUrl: "https://github.com/phobal/blog/issues/6"
---

> 最近去了几次共享自习室，也萌生了开共享自习室的想法，但是现在自习室也比较多，不知道开起来后到底怎么样，于是就想对现有的自习室每天的使用情况做一个统计，这个[项目](https://github.com/phobal/zaozixi)就是对几个自习室的一些数据爬取任务

### 流程

1. 从各自的小程序中获取座位预订情况
2. 清洗数据，获取需要的数据
3. 存数据
4. 定时自动执行 1 - 3 步
5. 分析数据

### 展开说说

#### 数据爬取

爬取很简单，通过 Charles 对小程序进行抓包，然后找到相应的接口，然后在服务器端发送 http 请求，模拟用户操作。  

#### 数据存储

拿到数据后过滤掉不需要的数据，这里只是需要 当前使用人数 和 使用人数的占比，接下来就是存储。  
这里选用了 [Maptable](https://maptable.com/) 作为存储介质，Maptable 是新一代的空间数据协同工具，包括表格工具、地图工具和数据市场。其中表格工具提供了 OpenAPI 的能力，支持通过调用接口的形式将自己的数据动态的添加到表格中。  

Maptable [官方示例](https://maptable.feishu.cn/docs/doccn8sDXlBQkj7GHwRcUOVcBdc#)使用的 Python 代码，而我比较擅长 TypeScript, 所以就用 TypeScript 封装一套 Nodejs 版本的 OpenAPI - [maptable-nodejs-sdk](https://github.com/phobal/maptable-nodejs-sdk), 让使用起来更加的方便。

``` ts
import Maptable from 'maptable-nodejs-sdk'

const appId = process.env.APP_ID
const appSecret = process.env.APP_SECRET
const maptable = new Maptable(appId, appSecret)

async function example() {
  const workspaces = await maptable.getAllWorkspaces()
  console.log(workspaces)
}
```
![image](/images/legacy/issue-6-1.png)

在线访问地址：https://maptable.com/s/t/cgtsugc89m2o

#### 定时任务

一开始想用 [later](https://github.com/bunkat/later#readme) 来做 schedule, 任务执行就放到 github 的 Action 中去执行，后面想到 Action 也支持定时任务的，所以就去掉了 later, 直接改用 github 的 Action 提供的定时任务。

``` yaml
on:
  schedule:
    - cron: '0,30 * * * *'
```

#### 数据分析

Maptable 是一个非常优秀的数据分析工具，不仅提供了数据表和地图功能，还提供了仪表盘(Dashboard) 功能，支持用户选择任意数据表中的任意字段，通过可视化图表的形式进行展示

![one自习折线图](/images/legacy/issue-6-2.png)

在线访问地址：https://maptable.com/s/d/cgtytdv9bwu8


### 总结

这几天对 Maptable 体验下来, 整体感觉挺好的，在封装 SDK 的过程中虽然遇到了不少问题，偶尔也会对 API 的设计合理性不认同，但是整体还可以，通过 SDK 的封装已经抹平了很多使用上的屏障，已经达到我个人满意的样子。  
对于跟我有类似使用场景的朋友希望能提供一些思路。
