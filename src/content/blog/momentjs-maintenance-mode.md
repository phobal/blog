---
title: "【官宣】 Momentjs 宣布正式进入维护期"
description: "翻译 Moment.js 官方项目状态说明，了解其进入维护期的背景。"
pubDate: "2020-09-17"
tags: ["翻译", "JavaScript"]
originalUrl: "https://zhuanlan.zhihu.com/p/248438892"
---

> 近期，Momentjs 在官方文档中发布了 Project Status，文中写道：Momentjs 正式进入维护期，不会再提供大版本更新，推荐使用**其他时间处理库代替**或使用 JavaScript 处于实验阶段的提案 **Temporal**。以下是对 Project Status 的中文翻译。

[Moment.js](https://github.com/moment/moment) 已广泛应用于数百万个项目中，能帮助你处理网站中日期和时间的问题，我们感到万分荣幸。截至 2020 年 9 月，Moment 每周获得超过 1200 万次下载！然而 Moment 是为 JavaScript 生态系统的前一个时代而构建的。这些年 Web 发生了很多变化，Moment 也在跟着发展，但其设计与 2011 年创建时的设计基本相同。鉴于有很多项目依赖它，所以*我们优先考虑稳定性而不是新功能*。

Moment 对象是可变对象（mutable），这点经常被用户所诟病。尽管我们在 [使用指南](https://momentjs.com/guides/#/lib-concepts/mutability/) 中写了如何解决这个问题，但还是有很多新用户犯错。如果将 Moment 变为不可变对象（immutable）这会对已使用 Moment 的项目产生破坏性的影响。支持 immutable 的 v3 版本是件很艰巨的任务，这将使 Moment 变为另外一个库，其实有很多类似的库已经实现这个特性，所以让 Moment 保持 mutable 也没什么不好。

另一个反对使用 Moment 的点是它的包体积大小，而 tree shaking 对 Moment 无效，导致应用的包体积剧增。如果你的应用中需要用到国际化和时区，那么 Moment 可能会大到超乎想象。现代 Web 浏览器（和 Node.js）通过 [Intl](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl)` 对象（编码为`[`ECMA-402`](https://ecma-international.org/ecma-402/)）开放了国际化和时区支持。而像 [Luxon](https://moment.github.io/luxon/) 之类的库就利用了这一优势来降低库文件的大小。

最近，Chrome开发工具 [开始显示有关更换 Moment 的建议](https://twitter.com/addyosmani/status/1304676118822174721)。我们也赞成该举动。

社区针对这个问题发表过很多文章：

- [*你可能不再需要 Moment.js*](https://dockyard.com/blog/2020/02/14/you-probably-don-t-need-moment-js-anymore)
- [*你（可能）不需要 Moment.js*](https://github.com/you-dont-need/You-Dont-Need-Momentjs/blob/master/README.md)
- [*为什么你不需要使用 Moment.js...*](https://inventi.studio/en/blog/why-you-shouldnt-use-moment-js)
- [*4 个可替代 moment.js 的库，用于国际化日期*](https://blog.logrocket.com/4-alternatives-to-moment-js-for-internationalizing-dates/)

Moment 团队也针对这些问题做过详细的讨论。我们意识到很多现有项目还在使用 Moment。 但我们并不推荐你在新的项目中使用它，相反，我们想 [推荐](https://momentjs.com/docs/#/-project-status/recommendations/) 一些能更好应用于现代 Web 的库。我们还想推荐 JavaScript 处理时间的新特性 - [`Temporal`](https://momentjs.com/docs/#/-project-status/future/)  该特性正在寻找反馈和贡献者。

**我们正式宣布 Moment 进入维护期，但并非消亡，只是完成了使命。**

事实上，这意味着：

  - [我们不再添加新功能。](https://momentjs.com/docs/#/-project-status/future/)
  - [我们不会将 API 变为 immutable。](https://momentjs.com/docs/#/-project-status/future/)
  - [我们不会解决 tree shaking 和 包体积的问题。](https://momentjs.com/docs/#/-project-status/future/)
  - [我们不会进行任何重大更改（不会有 v3）。](https://momentjs.com/docs/#/-project-status/future/)
  - [我们可能选择不修复 bug，特别是是长期存在的已知 bug](https://momentjs.com/docs/#/-project-status/future/)。

关于 Moment 的国际化语言环境文件：

  - [我们可能选择不接受对语言环境字符串或本地化日期格式的更正，特别是已经确认针对它们的当前格式提出了更正。](https://momentjs.com/docs/#/-project-status/future/)
  - [语言环境发生重大改变的，你必须提出新的令人信服、非轶事证据来支持你的立场。](https://momentjs.com/docs/#/-project-status/future/)
  - [如果你要更改字符串或格式，那么你必须先在](https://momentjs.com/docs/#/-project-status/future/)[CLDR 上](http://cldr.unicode.org/)提交更改申请并被接受后才行。

但是，由于 Moment 使用者还很多，当遇到下面问题时我们会处理的:

  - 当出现严重的安全问题时，我们*将*予以解决。
  - 我们*将*在 [IANA时区数据库](https://www.iana.org/time-zones) 发布后更新 Moment-Timezone 的数据。

## **需要继续使用 Moment 的场景**

在大多数情况下，你不应为新项目选择 Moment。但是，有一些特殊的原因你可能还是得继续使用它。

**浏览器支持**

Moment  能在 IE8 下完美运行。相比之下，Luxon 只能在 IE 10 及更高版本上运行，并且需要使用 polyfill 进行操作。 [您可以在Luxon的文档中阅读更多内容。](https://moment.github.io/luxon/docs/manual/matrix.html)其他库也存在 Safari 问题。尤其是在移动设备上。如果你非要支持旧版本浏览器，则可能继续使用 Moment。

但是，[Day.js 报告了与 IE8 及更高版本的兼容性，](https://day.js.org/docs/en/installation/installation)因此你可以考虑使用它。

**其他库的依赖**

有些库，尤其是日期选择器和图形库，很多都将 Moment 作为依赖项，如果你正在使用这样的组件而找不到替代组件，那么你的项目中已经包含了 Moment。你可以在整个项目中继续使用 Moment，而不是再引用另一个日期和时间库。

**忠实粉丝**

如果你是 Moment 的忠实粉丝，你肯定非常了解它的 AP I和局限性。并且不 care 这些问题，那么你当然可以继续使用它。

## **推荐一些替代库**

有很多不错的库可以代替 Moment。
在做选择时，请考虑下面几点：

  - 有些库分为模块，插件或配套库。
  - 有些库将 ECMAScript [IntlAPI](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl) 用于语言环境、时区或两者都有用到。
  - 有些库仍像 Moment 和 Moment-Timezone 一样提供自己的语言环境和时区文件。

**以下是我们推荐的替代方法：**

[Luxon](https://moment.github.io/luxon/) 可以认为是 Moment 的演变，它由 Moment 的长期撰稿人 [Isaac Cambron](https://github.com/icambron) 撰写。请阅读 [*为什么会存在 Luxon*](https://moment.github.io/luxon/docs/manual/why.html) 以及  Luxon 文档中的 [*For Moment用户 页面。*](https://zhuanlan.zhihu.com/p/248438892/htt%3C/i%3Eps://moment.github.io/luxon/docs/manual/moment.html)

  - 语言环境：`Intl`提供
  - 时区：`Intl`提供

[Day.js](https://day.js.org/) 使用类似的 API，Day.js 被设计为 Moment.js 的极简替代品。它不是临时替代品，如果你习惯使用 Moment 的 API 并希望快速入门，请考虑使用 Day.js。

  - 语言环境：可以单独导入的自定义数据文件
  - 时区：`Intl`通过插件提供

[date-fns](https://date-fns.org/) 提供了一系列用于处理 JavaScript  [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) 对象的函数。有关更多详细信息，请到 date-fns 主页中滚动到 “为什么使用 date-fns？”。

  - [语言环境：可以单独导入的自定义数据文件](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)
  - 时区：`Intl`通过单独的库提供

[js-Joda](https://js-joda.github.io/js-joda/)js 是 Java 的 [Three-Ten Backport](https://www.threeten.org/threetenbp/) 的 JavaScript 版本，该 backport 是 Java SE 8 `java.time`包中 JSR-310 实现的基础。如果你熟悉[`java.time，`](https://zhuanlan.zhihu.com/p/248438892/%3C/code%3Ehttps://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html)[`Joda-Time`](https://www.joda.org/joda-time/) 或 [Noda Time](https://nodatime.org/)，您会发现 js-Joda 具有可比性。

  - 语言环境：通过附加模块的自定义数据文件
  - 时区：通过附加模块的自定义数据文件

## **不使用任何第三方库**

JavaScript 一直有一个[`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)对象，定义的 ECMAScript（ECMA-262）规范[这里](https://www.ecma-international.org/ecma-262/11.0/index.html#sec-date-objects)。

使用`Date`对象时，请注意以下几点：

  - 该`Date`对象内部具有毫秒精度的 Unix 时间戳。它提供了可以在系统本地时区之间来回转换的功能，但是内部*始终*是 UTC。与  `Moment` 对象不同，不能将其设置为使用其他时区。它没有“模式”的概念。
  - 过去使用[`Date.parse`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)或[`new Date(<string>)`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#Timestamp_string) 一直存在问题，并且实现不一致。[当前的规范](https://www.ecma-international.org/ecma-262/11.0/index.html#sec-date-time-string-format) 定义解析 ISO 8601 的字符串，其中日期仅有的形式（如`"2020-09-14"`）被解析为 UTC，而不是本地时间，因为他们会通过 ISO 8601。即便如此，并不是所有的现代浏览器都按照这个标准来实现的（例如 Safari 就没按照这个来）。其他类型的字符串*也可以*使用，但是解析它们是另外实现的，并且可能会有很大的不同，特别是对于老版本的浏览器。根据实现方式以及字符串中提供的组件，你可能会对结果感到惊讶。由于这些原因，我们同意 [MDN的声明](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#Timestamp_string)，即 **强烈反对使用 Date对象**。

现代 JavaScript 环境也将通过实施 [ECMA-402](https://www.ecma-international.org/ecma-402) 规范，它提供了[`Intl`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl)对象并在 Date`对象上定义了`toLocaleString`，`toLocaleDateString`和`toLocaleTimeString` 方法。

使用`Intl`对象时，请注意以下几点：

  - [并非每个环境都会实现完整的规范。特别是，Node.js 环境需要 ICU 提供的国际化支持。有关更多详细信息，请参见](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl)[Node.js文档](https://nodejs.org/docs/latest-v12.x/api/intl.html)。
  - [ECMAScript Intl 兼容性列表 (由 kangax 提供)](http://kangax.github.io/compat-table/esintl/) ，可以方便查询支持情况。
  - 多数较新的环境提供了通过 IANA 时区支持`timeZone`的`Intl.DateTimeFormat`构造函数（和`Date.toLocaleString`，`Date.toLocaleDateString`和`Date.toLocaleTimeString`）选项。该选项可用于获取对象的内部基于 UTC 的时间戳和获取已转换为命名时区的*字符串*。但是，它不能将 `Date` 对象转换为其他时区。

如果`Date`和`Intl`对象满足你的需求，并且你完全了解它们的局限性，则可以考虑直接使用它们。

## **未来**

**Temporal**  - 使用 JavaScript 自带的时间和日期会更好、

将来，我们希望完全不依赖 JavaScript 中的日期和时间库。而是直接使用 JavaScript 语言本身的功能。尽管今天有[`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)  和提供一些功能`Intl，`但我们从过往经验和数据中知道他们仍有很大的改进空间。

[通过](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl)[ECMA TC39临时提案，](https://tc39.es/proposal-temporal/docs/index.html) 可以看到，组织正在努力为 JavaScript 语言编写更好的日期和时间 API 。目前已处于[TC39流程的](https://tc39.es/process-document/) 第二阶段。

`Temporal`将是一个充当顶级名称空间（如`Math`）的新全局对象。它暴露了许多不同的类型的对象，包括`Temporal.Absolute`，`Temporal.DateTime`，`Temporal.Date`，`Temporal.Time`，`Temporal.TimeZone`等。[Temporal Cookbook](https://tc39.es/proposal-temporal/docs/cookbook.html)  包含了许多案例，并举例说明了如何在不同情况下使用这些对象。

你可以通过这个  [实验性的 polyfill](https://github.com/tc39/proposal-temporal/tree/main/polyfill) 来体验它，但还是别在生产环境中使用它。

如果你有使用 Moment 或其他日期和时间库的经验，并且对 Temporal 感兴趣，欢迎提供反馈和参与开发，

原文：[https://momentjs.com/docs/#/-project-status/](https://momentjs.com/docs/#/-project-status/)
