---
title: "构建自己的 css-in-js 库"
description: "从零开始构建一个 css-in-js 库，理解样式生成的核心机制。"
pubDate: "2022-12-13"
tags: ["CSS", "前端"]
originalUrl: "https://github.com/phobal/blog/issues/5"
---

> 最近在看 `antd5`，其中有一个很重大的改变就是将 css 方案由 less 换成了 `css-in-js` 的方案。之前用过 `styled-components` 和 `emotion`， 但是一直没研究过他们的实现，处于好奇翻了翻他们的源码，下面是一些总结。
    
    

### 大纲

- 什么是 `CSS-in-JS`
- `CSS-in-JS` 原理介绍
- 支持 css(``) 语法
- 支持 css`` 语法
- 支持 prefix 前缀
- 支持 SSR

### 什么是 `CSS-in-JS` ？

CSS-in-JS 是一种将 CSS 样式直接写入 JavaScript 代码中的方法。这种方法的优点在于，它可以让你在 JavaScript 代码中直接使用变量和函数来管理样式，并且可以通过模块系统来组织样式。由于 CSS-in-JS 的方法是在运行时动态地将样式应用到 DOM 元素上，因此可以实现一些传统 CSS 所无法实现的功能，例如在不同媒体查询中应用不同的样式。

### `CSS-in-JS` 原理

简单来说就是通过 js 的 ****`insertRule`**** 方法将 `cssRules`  动态的插入到页面上。

```tsx
function insertStyle(style) {
  // 创建一个新的样式表
  const styleElement = document.createElement('style');

  // 将样式表插入到页面的 head 元素中
  document.head.appendChild(styleElement);

  // 向样式表中插入新的 CSS 规则
  styleElement.sheet.insertRule(style);
}

// 在页面中插入一个新的 CSS 规则
insertStyle('body { background-color: red; }');
```

上面的 `body { background-color: red; }` 就是 `cssRule`, `css-in-js` 库做的事情就是将通过 `js` 写的 样式代码转化成原生的 css 代码。

### 支持 css(``) 语法

下面看下 [`emotion` ](https://github.com/emotion-js/emotion)的简单用法

```tsx
import { css } from '@emotion/css'

render(
  <div
    className={css(`
      padding: 32px;
      background-color: hotpink;
      font-size: 24px;
      border-radius: 4px;
    `)}
  >
    Hover to change color.
  </div>
)
```

官方示例：[https://emotion.sh/docs/introduction](https://emotion.sh/docs/introduction)

可以看到它提供了一个 css(``) 方法，它接收一个样式规则的字符串，并返回一个 `className` 并能将该规则插入到样式表

```tsx
const sheet = document.head.appendChild(document.createElement('style')).sheet;

const css = (styleString) => {
  const className = getClassName);

  sheet.insertRule(`.${className} { ${styleString} }`);

  return className;
};
```

插入规则其实很简单，通过 getClassName() 方法去生成一个类名，然后将该类名插入到样式表中，其中最关键的点就是如何去实现 getClassName 方法。[emotion ](https://github.com/emotion-js/emotion)的做法是 `css` + `hash_code`, 类似`css-czz5zq` 、`css-12mcb0` ,这是一种常规的做法。我们这里简单一点儿，直接用 `css` + `sheet.length` 

[https://codesandbox.io/embed/confident-mestorf-rm0b0c?autoresize=1&fontsize=14&hidenavigation=1&theme=dark](https://codesandbox.io/embed/confident-mestorf-rm0b0c?autoresize=1&fontsize=14&hidenavigation=1&theme=dark)

上面我们主要实现了带括号的 css(``) 语法，但在 emotion 库中大多是使用 css`` 语法，接下来我们来实现一下。

### 支持 css`` 语法

```tsx
const blue = css`
	color: blue;
`;
```

实际上上面一段代码是一个有效的 JavaScript 代码，要了解上面代码实际发生了啥，可以看下面代码

```tsx
const myConsole = (...args) => console.log(args);

myConsole`COVID-2019 is dangerous` 

// => [["COVID-2019 is dangerous"]]
```

返回一个以我们输入的字符串为元素的数组。让我们看看如果我们在模板文字中引入一些注入变量会发生什么

```tsx
const myConsole = (...args) => console.log(args);

const virus1 = "Omicron";
const virus2 = "Delta‘";

myConsole`COVID-2019 is dangerous， it will mutate into ${virus1} and ${virus2}`;

// => [['COVID-2019 is dangerous， it will mutate into ', ' and ', ''], "Omicron", "Delta"]
```

它似乎是将传入的字符串变为了一个二维数组，第一个数值值为原字符，但是将变量的位置给切断了，然后用一个空格占位，其余数组元素用真实的值替代。

它实际上与这样调用 myConsole 是一样的效果

```tsx
myConsole(["COVID-2019 is dangerous， it will mutate into ', ' and '"], "Omicron", "Delta")
```

搞清楚了这个就简单了，接下里我们只需要写一个方法，将 myConsole 方法输出为完整的字符串就行了。

```tsx
const interleave = (strings, interpolations) => {
  let output = '';

  strings.forEach((s, i) => {
    output += s;
    output += interpolations[i] === undefined ? '' : interpolations[i];
  });

  return output;
};

// ...interpolations 使用了解构，表示模板字符串中的变量
const myConsole = (strings, ...interpolations) => interleave(strings, interpolations);

myConsole`COVID-2019 is dangerous， it will mutate into ${virus1} and ${virus2}`;
// => COVID-2019 is dangerous， it will mutate into Omicron and Delta
```

接下来我们在 css`` 中来应用它

```tsx
const css = (strings, ...interpolations) => {
  const styleString = interleave(strings, interpolations);
  const className = `css-${sheet.cssRules.length}`;

  sheet.insertRule(`.${className} { ${styleString} }`);

  return className;
};
```

[https://codesandbox.io/embed/confident-mestorf-rm0b0c?fontsize=14&hidenavigation=1&theme=dark](https://codesandbox.io/embed/confident-mestorf-rm0b0c?fontsize=14&hidenavigation=1&theme=dark)

### 支持 prefix 前缀

一些 CSS 属性需要有浏览器供应商前缀才能工作。这可能是因为它们是非标准的， [[有关 MDN 的更多信息](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix)](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix)。

通常，供应商前缀是在编译时使用诸如 [[autoprefixer](https://github.com/postcss/autoprefixer)](https://github.com/postcss/autoprefixer)之类的工具添加的。但是对于我们的案例，我们将在运行时使用 `[tiny-css-prefixer](https://github.com/kitten/tiny-css-prefixer)`.

**`tiny-css-prefixer`**带有一个简单的**`prefixProperty()`**功能。我们可以在这样的辅助函数中使用它：

```tsx
import { prefixProperty } from 'tiny-css-prefixer';

const prefix = (prop, value) => {
  const flag = prefixProperty(prop);
  let css = `${prop}: ${value};\n`;
  if (flag & 0b001) css += `-ms-${css}`;
  if (flag & 0b010) css += `-moz-${css}`;
  if (flag & 0b100) css += `-webkit-${css}`;
  return css;
};

prefix('writing-mode', 'auto');
// =>
// writing: auto;
// -ms-writing: auto;
// -webkit-writing: auto;
// -ms-writing: auto;
```

我们的辅助**`prefix()`**函数可以接收 CSS 属性和值，并向其添加必要的供应商前缀。接下来，我们将在我们的**`css()`**函数中使用这个辅助函数。

[https://codesandbox.io/embed/confident-mestorf-rm0b0c?fontsize=14&hidenavigation=1&theme=dark](https://codesandbox.io/embed/confident-mestorf-rm0b0c?fontsize=14&hidenavigation=1&theme=dark)

### 支持 SSR

最后我们再支持一下服务器端渲染，大体思路就是有一个方法可以来提取样式表并把它们注入到 `<styke>` 标签中去。因为前面用的方法是基于浏览器端 CSSStyleSheet 提供的能力，在 Nodejs 环境中不存在该对象，所以我们需要手动来模拟它。

```tsx
const sheet =
  typeof window !== 'undefined'
    ? document.head.appendChild(document.createElement('style')).sheet
    : mockSheet();
```

接下来实现 mockSheet 方法，通过上面的代码可以看得出来，实际上我们需要 cssRules 和 insetRule， 另外需要一个导出所有 cssRules 为 string 的方法

```tsx
const mockSheet = () => {
  // the mock sheet need to have at least 2 properties
  // 1. cssRules: an array of rules in the sheet
  // 2. insertRule: a method to insert rules to the sheet
  // 3. extract: a method to return all the style strings
  const cssRules = [];

  return {
    cssRules,
    insertRule: (rule) => {
      cssRules.push(rule);
    },
    extract: () => cssRules.join(''),
  };
};
```

[https://codesandbox.io/embed/gallant-christian-ddh5ku?fontsize=14&hidenavigation=1&theme=dark](https://codesandbox.io/embed/gallant-christian-ddh5ku?fontsize=14&hidenavigation=1&theme=dark)

### 总结

从上面的讲解来看，实际上 CSS-in-JS 库核心就是利用 CSSStyleSheet 对象的能力，将 js 写的 css 代码动态的插入到 <style> 标签里面去。上面只是实现了核心的部分，还有很多需要处理，比如：

- keyframes() 方法
- global() 方法
- theme 定制
- 样式 tree-shaking
- 样式的动态加载

参考： 

[https://jackyef.com/posts/writing-your-own-css-in-js-library](https://jackyef.com/posts/writing-your-own-css-in-js-library)

[https://github.com/jackyef/basic-css-in-js](https://github.com/jackyef/basic-css-in-js)
