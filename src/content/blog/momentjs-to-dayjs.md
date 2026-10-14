---
title: "从 momentjs 迁移至 dayjs"
description: "在微信小程序项目中从 momentjs 迁移到 dayjs，缩减代码包体积。"
pubDate: "2019-04-28"
tags: ["JavaScript"]
originalUrl: "https://zhuanlan.zhihu.com/p/61031739"
---

## 背景

众所周知，微信小程序对上传的代码包有大小限制，单包不能超过 2M，总大小上限为 8M，对于稍微复杂一点儿的项目很容易就达到了上限 2M 的限制。当然笔者同样面临了这方面的问题。

在对代码包进行缩减前首先要做的是找出项目中哪些文件对最终打包出的代码体积影响是最大的，幸运的是  `[webpack-bundle-analyzer](<https://github.com/webpack-contrib/webpack-bundle-analyzer>)` 替我们提供了一个可视化的 dashboard，可以很直观的发现哪些第三方包或者代码文件占用的大小。

![文章配图](/images/zhihu/61031739-1.jpg)

上图是打包出来各文件的大小分布图，红色部分就是本篇文章的主角 - moment-core.js 大小是 65.12 KB，看得出这个大小并不算小了。了解到 [dayjs](https://github.com/iamkun/dayjs) 有类似于[momentjs](https://github.com/moment/moment) 的功能，且以轻量化著称，gzip 大小仅为 2KB，便决定使用 dayjs 替换掉现有项目中的 momentjs。

## 过程

由于 `dayjs` `API` 设置和 `momentjs` 保持了一致，所以迁移成本将低了很多，基本只需要 2 步

1. 安装 `dayjs`

```
 yarn add dayjs
 
```

1. 设置 `alias`

```
{
  "resolve": {
    "alias": {
      "moment": "dayjs"
    }
  }
}
```

这里设置 `alias` 的作用主要是不用破坏原有代码。

之前引用 `momentjs` 的方式如下：

```
import moment from 'moment'

const tomorrow = moment().add(1, 'day')
```

如果不设置 `alias` 的话之前凡是引用 moment 的地方你都得改成这样

```
import dayjs from 'dayjs'

const tomorrow = dayjs().add(1, 'day')
```

如果项目中用 moment 比较多的地方那改起来可谓是一场重体力活

如果只是使用到了 momentjs 基础功能，通过以上步骤就能直接替换到 momentjs，如果还使用到了一些特殊功能，比如对时间进行比较 和 高级格式化时间等，就需要用到 dayjs 提供的 [插件](https://github.com/iamkun/dayjs/blob/dev/docs/zh-cn/Plugin.md) 机制，当然这个也是 dayjs 宣传自己这么小的原因，对于比较小众需要处理时间的问题都可以交给插件来处理。试用方法也很简单，比如需要使用到 [relativeTime](https://github.com/iamkun/dayjs/blob/dev/docs/zh-cn/Plugin.md#relativetime)

```
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

dayjs().from(dayjs('2017')) // 2 年以前
```

更多插件信息见[官方文档](https://github.com/iamkun/dayjs/blob/dev/docs/zh-cn/Plugin.md)

## 差异

目前 dayjs 并没有实现完所有的 momentjs 提供的功能，下面是一些差异点，在迁移的过程中需要注意

- 不支持  `get` 方法

```
// momentjs
moment('2019-03-31 09:00:00').get('H') // 9

// dayjs
dayjs('2019-03-31 09:00:00').get('H') // TypeError: dayjs(...).get is not a function
```

dayjs 提供了相应的方法，比如上面要获取小时数，有一个 `hour` 方法

```
dayjs('2019-03-31 09:00:00').hour()
```

- 不支持 `duration` 方法

```
 moment.duration(100)  // 100 毫秒
 
```

相应的需要对 duration 进行转化的方法也不支持，比如 `asSeconds、asMinutes、asHours`等方法，更多方法见[这里](https://momentjs.com/docs/#/durations/seconds/)

- 不支持 `set utcOffset` 方法

```
 // momentjs
 moment("2019-04-02 23:11:10").utcOffset(120)  // 返回一个 moment 对象
 // dayjs
 dayjs("2019-04-02 23:11:10").utcOffset(120)  // 480
```

- 不支持 `calendar` 方法

```
 moment('2019-03-31 09:00:00').calendar(moment().add(1, 'd')) // Last Sunday at 9:00 AM
 
```

这个方法在作者的帮助下已经实现，commit 见[这里](https://github.com/iamkun/dayjs/commit/d1b9cf97cc77e9ec45ddd7349076a44b2ab9c165)

可能还有一些没列举完的，目前还没使用到，欢迎补充

## 总结

dayjs 是比较轻量化的时间处理库，在新项目中需要时间处理库优先选择 dayjs。当然从老的项目迁移到 dayjs 成本也不算高。

整体来看 dayjs 有如下

优点：

- 轻量化。gzip 大小仅 2KB
- 同 momentjs API 保持一致，迁移成本低

缺点：

- 同 momentjs 一样采用 OO 思想，非纯函数，不够函数式
- 不支持 [Tree-shaking](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)

另外附上一张本次迁移成果对比图

使用 momentjs

![文章配图](/images/zhihu/61031739-2.png)

使用 dayjs

![文章配图](/images/zhihu/61031739-3.png)

对比下来代码包减少了 42.3 kb

更多关于时间库相关的话题可以移步这里

[https://github.com/you-dont-need/You-Dont-Need-Momentjs](https://github.com/you-dont-need/You-Dont-Need-Momentjs)

### **2019.04.02 更新**

已经支持 get 方法，最新版本的 1.8.12 , [commit Id](https://github.com/iamkun/dayjs/commit/73187972c7265785c93d4d4c9e8d079143d777fd)

### **2019.04.28 更新**

1. 不支持 hours 方法

```
dayjs().hours() // throw error

moment().hours() // ok
```

解决方法：dayjs 提供了 hour 方法，效果 moment 提供的 hours 方法一样

2、国际化的 name 不一致

dayjs 的国际化(i18n) 是作为插件导入的，在对语言包命名的时候统一使用小写，如使用中文包是这样的

```
dayjs.locale('zh-cn')
```

而 moment 的语言包命名则是 小写 + 大写

```
moment.locale('zh-CN')
```

完
