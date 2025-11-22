# Discuss 评论组件

借助 Supabase 可以把 wiki 页面变成“可讨论的攻略页”。下面是启用 `<Discuss />` 组件所需的全部步骤。

## 1. 配置 Supabase Key

1. 在 `docs` 目录新增 `.env`（或 `.env.local`）并写入（请在 Supabase 控制台中依次打开 `Settings -> Data API` 复制 `VITE_SUPABASE_URL`，以及 `Settings -> API Keys` 复制 `VITE_SUPABASE_ANON_KEY`）：

```bash
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

2. 部署到 Vercel 时，在 “Environment Variables” 中添加以上两项。
3. 本地 `pnpm dev`/`pnpm build` 会自动读取 `import.meta.env.*`，无需额外引入。

> 如果变量缺失，组件会在页面上提示“尚未配置 Supabase”。

## 2. 建表 & 安全策略

在 Supabase SQL Editor 中执行一次：

```sql
create table public.discussions (
  id bigint generated always as identity primary key,
  page_path text not null,
  page_title text,
  author text,
  content text not null,
  created_at timestamptz default now()
);

alter table public.discussions enable row level security;

create policy "公开阅读" on public.discussions
  for select using (true);

create policy "匿名写入" on public.discussions
  for insert with check (true);
```

以上策略允许所有访客读取与写入（匿名站点通常如此）。如果想限制频率，可在 Supabase 侧加上 Rate Limit 或 Edge Function 校验。

## 3. 页面内使用

在任意 Markdown 尾部写入：

```md
## 讨论区
<Discuss />
```

默认使用当前 `route.path` 作为讨论 ID。如果需要共用一个讨论串，可设置 `pageId`：

```md
<Discuss pageId="talk:main-story" />
```

## 4. 数据字段说明

| 字段         | 说明                       |
| ------------ | -------------------------- |
| `page_path`  | VitePress 当前路径或自定义 |
| `page_title` | 自动取页面标题             |
| `author`     | 输入框，可空则显示“无名侠客” |
| `content`    | 评论正文，500 字上限       |
| `created_at` | Supabase 默认时间戳        |

## 5. 很常见的问答

- **如何防刷屏？** 可以在 Supabase Dashboard -> Authentication -> Rate Limits 里设置匿名写入的节流，或改成自建 API。
- **能否二次审核？** 目前组件是实时写入，如需审核可在表里加 `is_visible` 字段，并在查询时 `.eq('is_visible', true)`。
- **SSR 是否安全？** 读取/写入都发生在浏览器端，服务端渲染阶段不触发 Supabase，因此不会阻塞构建。
