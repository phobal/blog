import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
  console.error('用法：npm run new -- "文章标题"');
  process.exit(1);
}

const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date());
const slug = title.toLowerCase()
  .normalize('NFKD')
  .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
  .replace(/^-|-$/g, '') || 'new-post';
const directory = join(process.cwd(), 'src/content/blog');
mkdirSync(directory, { recursive: true });
let file = join(directory, `${today}-${slug}.md`);
let suffix = 2;
while (existsSync(file)) file = join(directory, `${today}-${slug}-${suffix++}.md`);

const content = `---
title: ${JSON.stringify(title)}
description: "在这里写一段文章摘要。"
pubDate: ${today}
tags: []
draft: true
---

从这里开始写正文。
`;
writeFileSync(file, content);
console.log(`已创建 ${file}\n写完后把 draft 改为 false，即可在网站发布。`);
