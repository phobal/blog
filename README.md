# Phobal 的博客

基于 [Astro](https://astro.build/) 的个人博客。文章以 Markdown 文件保存在 `src/content/blog/`，构建时生成静态页面。

## 本地运行

需要 Node.js 22 或更新版本。

```bash
npm install
npm run dev
```

打开终端提示的地址（通常是 `http://localhost:4321`）。发布前运行 `npm run check` 和 `npm run build`。

## 写一篇新文章

```bash
npm run new -- "我的新文章"
```

脚本会在 `src/content/blog/` 创建 Markdown 草稿。填写 `description`、`tags` 和正文后，将 `draft: true` 改成 `draft: false`。文件名就是文章网址的一部分，例如 `my-post.md` 对应 `/blog/my-post/`。也可以直接复制现有文章作为模板。

图片可以放在 `public/images/`，在 Markdown 中用 `/images/文件名.png` 引用。改动 Markdown 后，本地开发服务器会自动刷新。

## 旧文章迁移

- 原仓库的 6 篇 GitHub Issues 已迁入 `src/content/blog/`，正文为 Markdown，文末保留原文链接。其中第 1 篇虽未列在原 README，但同样属于该博客的文章。
- 原 README 中 9 篇知乎文章的正文目前无法从知乎读取，暂时在首页“旧文存档”保留原文链接，集中维护于 `src/data/links.ts`。拿到 Markdown 或 HTML 导出后，可以按上面的格式迁入内容目录，再从链接列表移除对应条目。
- 原 README 中的 4 个技术分享链接保留在首页“技术分享”。

## 部署

`npm run build` 会生成 `dist/`，可部署到支持静态网站的服务。若部署在子路径下（例如 GitHub Pages 的 `/blog/`），需要在 `astro.config.mjs` 设置对应的 `base`，并检查站内链接与图片路径。
