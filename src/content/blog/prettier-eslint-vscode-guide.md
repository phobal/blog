---
title: "Prettier + ESLint VSCode 插件配置指南"
description: "配置 VSCode 中的 Prettier 与 ESLint 插件，让代码格式与检查协同工作。"
pubDate: "2020-07-29"
tags: ["VSCode", "工具"]
originalUrl: "https://zhuanlan.zhihu.com/p/145601639"
---

> 经常在 code review 的时候发现有些同学提交上来的代码格式还存在问题，很影响阅读代码的情绪，究起原因来无非是两种情况：1、git commit 的时候加了 -n 参数，跳过了 eslint 检查和 prettier 格式化。2、VSCode 中 ESLint 和 Prettier 插件未配置正确。接下来看一下如何正确配置这 2 个插件(着重 prettier 插件)

相信做过前端的同学对 [ESLint](https://eslint.org/) 和 [Prettie](https://prettier.io/)r 都不陌生了吧？这里先还是先简单介绍一下吧

ESLint 属于一种QA工具，是一个ECMAScript/JavaScript语法规则和代码风格的检查工具，可以用来保证写出语法正确、风格统一的代码。

Prettier 是一个自动帮你处理代码中不符合 ESLint 规范的工具。

上面 2 个工具库都是在项目代码中进行配置的，这篇文章主要介绍如何配合 eslint 和 prettier 对应的 vscode 插件在代码编写过程中及时帮我们修正问题，而不是等到 git commit 的时候才发现一大堆问题。所以至于如何在项目代码中如何使用这里不做介绍，可以参考[这里](https://www.notion.so/phobal/Prettier-ESLint-VSCode-3bcf3bd9659540b38310a31a36aa77ce#5eb690876e2142ea84ba8447479cc126) 。

准备工具

在 VSCode  中安装以下插件

- ESLint VSCode 插件， 主要的作用是会将有错的地方进行标记，方便我们知道哪些文件、哪些代码是有问题的

[https://github.com/Microsoft/vscode-eslint github.com/Microsoft/vscode-eslint](https://github.com/Microsoft/vscode-eslint)

- Prettier VSCode 插件，主要作用是代码格式化的时候按照项目约定的规范进行代码美化

[prettier/prettier-vscode github.com/prettier/prettier-vscode](https://github.com/prettier/prettier-vscode)

### 开始设置

打开`vscode` 配置文件 `setting.json`,

快捷键：`command + p` 然后输入 `>`  进入命令搜索模式，再输入: `Settings(JSON)`

1、设置代码在保存的时候自动格式化

```
{
    "editor.formatOnSave": true
}
```

2、设置 `.js .ts .jsx .tsx .less .css .json` 格式的文件都采用 `prettier-vscode` 插件进行格式化

```
{
    "[javascript]": {
	"editor.defaultFormatter": "esbenp.prettier-vscode"
     },
    "[typescript]": {
	"editor.defaultFormatter": "esbenp.prettier-vscode"
     },
    "[javascript|react]": {
	"editor.defaultFormatter": "esbenp.prettier-vscode"
     },
    "[typescript|react]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
     },
    "[less]": {
         "editor.defaultFormatter": "esbenp.prettier-vscode"
     },
     "[css]": {
         "editor.defaultFormatter": "esbenp.prettier-vscode"
     },
     "[json]": {
	 "editor.defaultFormatter": "esbenp.prettier-vscode"
     }
}
```

3、配置 prettier 插件读取项目中哪个配置文件，默认是根目录下的 `.prettierrc` 文件，如果你的项目下不是这个文件就需要修改为你的配置文件，比如很多项目为 `.prettierrc.js` 或者 `.prettierrc.ts`

```
{
    "prettier.configPath": ".prettierrc.js",
}
```

至此配置过程就完成了，现在来试试效果

![文章配图](/images/zhihu/145601639-1.gif)

【完】
