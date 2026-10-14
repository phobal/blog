---
title: "一键收起 node_modules 文件夹"
description: "在 VSCode 中快速收起 node_modules 目录，减少文件树操作成本。"
pubDate: "2020-08-09"
tags: ["VSCode"]
originalUrl: "https://zhuanlan.zhihu.com/p/176873873"
---

### 问题

在使用 VSCode 的时候，不知道大家有没有遇到这个问题：

在写 TS 的时候经常会跳转定义，尤其是第三方库，然后会跳转到项目的 node_modules 目录下，这时左侧目录像这样：

![文章配图](/images/zhihu/176873873-1.png)

如果这时你想要去打开另外一个文件（假设你不知道文件具体名称），你可能得滑动左侧文件列表到你要找的文件，这会让你抓狂（反正我是很抓狂的）。

当时就在想，要是能有个按钮或者快捷键快速帮我收起来就好了。

### 调研

带着好奇心上网查了一下 VSCode 是否自带了这个功能，发现有 2 种方式可以解决收起的问题：

方法一、使用项目 View Item 右侧的收起全部功能，如图：

![文章配图](/images/zhihu/176873873-2.png)

这个确实能收起来，但是它不仅仅收起 node_modules  文件夹，还会收起其他文件夹，这个不是很立项。

方法二、VSCode 可以通过 `cmd + 左方向键`，来源看[这里](https://dev.to/dance2die/keyboard-shortcut-to-get-out-of-nodemodules-folder-in-visual-studio-code-5dd7)。

这个确实也能收起来，但是它需要鼠标 fouce 到文件夹上才行，不是很方便。

### 还是自己写吧

基于以上种种原因，决定还是自己来写一个。于是就有个这个插件

[https://marketplace.visualstudio.com/items?itemName=phobal.vscode-collapse-node-modules&ssr=false#overview](https://marketplace.visualstudio.com/items?itemName=phobal.vscode-collapse-node-modules&ssr=false#overview)

使用方法也很简单，提供了两种方法：

方式一：使用快捷键 `cmd + control + c` 快速收起（🔥推荐）

方式二：通过 VSCode 命令面板

1. 通过 `cmd + shift + p` 命令开发 VSCode 命令面板
2. 输入 `collapse`, 然后选择 `Collapse: collapse node_modules folder`

![文章配图](/images/zhihu/176873873-3.png)

### 最后

代码也开源了，感兴趣的可以看看

[https://github.com/phobal/vscode-collapse-node-modules](https://github.com/phobal/vscode-collapse-node-modules)

原理很简单：就是先隐藏 node_*modules 文件夹，再显示 node_*modules 文件夹, 就起到了折叠文件夹的作用。

【完】
