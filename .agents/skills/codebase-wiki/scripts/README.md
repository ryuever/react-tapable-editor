# codebase-wiki scripts

本目录包含 codebase-wiki skill 的初始化与导航生成脚本，支持 **VitePress**、**Mintlify** 和 **Starlight**（Astro）三种文档引擎。

## 架构说明

各引擎的模板文件（配置、首页、侧栏占位等）存放在 `assets/` 目录下：

```
assets/
├── vitepress/           # VitePress 项目骨架
│   ├── .vitepress/
│   │   ├── config.mts               # VitePress 配置模板
│   │   └── sidebar.generated.mts    # 侧栏空占位
│   └── INDEX.md                     # 首页模板
├── mintlify/            # Mintlify 项目骨架
│   ├── docs.json                    # Mintlify 配置模板
│   ├── INDEX.mdx                    # 首页模板
│   └── favicon.svg                  # 图标占位
└── starlight/           # Starlight/Astro 项目骨架
    ├── .starlight/
    │   └── sidebar.generated.mjs    # 侧栏空占位
    ├── src/
    │   ├── content.config.ts        # Astro 内容集合配置
    │   └── content/docs/index.mdx   # 首页模板
    ├── public/favicon.svg           # 图标占位
    └── astro.config.mjs             # Astro 配置模板
```

初始化脚本通过**复制骨架 + 变量替换**的方式生成目标项目结构，模板中使用 `__WIKI_TITLE__`、`__SOCIAL_LINKS__`、`__PRIMARY_COLOR__` 等占位符。

---

## 脚本一览

| 脚本 | 引擎 | 用途 |
|------|------|------|
| `init-vitepress.mjs` | VitePress | 复制 `assets/vitepress/` 骨架 + 变量替换 |
| `regenerate-sidebar.mjs` | VitePress | 重建 `.vitepress/sidebar.generated.mts` |
| `init-mintlify.mjs` | Mintlify | 复制 `assets/mintlify/` 骨架 + 变量替换 |
| `regenerate-navigation.mjs` | Mintlify | 重建 `codebase-wiki/docs.json` 中的 `navigation.groups` |
| `init-starlight.mjs` | Starlight | 复制 `assets/starlight/` 骨架 + 变量替换 |
| `regenerate-starlight-sidebar.mjs` | Starlight | 重建 `.starlight/sidebar.generated.mjs` |

---

## VitePress

### 初始化

```bash
node <skill-dir>/scripts/init-vitepress.mjs --root . --title "我的 Wiki"
```

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--root <dir>` | 目标仓库根目录 | `cwd` |
| `--skill-dir <dir>` | codebase-wiki skill 目录 | 脚本上级目录 |
| `--title <string>` | Wiki 标题 | `Codebase Wiki` |
| `--github <url>` | GitHub 仓库 URL（用于主题社交链接） | 空 |
| `--force` | 覆盖已有文件 | `false` |

### 安装与预览

```bash
pnpm add -D vitepress
pnpm run docs:wiki:dev
```

### 文档变更后重建侧栏

```bash
node <skill-dir>/scripts/regenerate-sidebar.mjs --root .
```

---

## Mintlify

### 初始化

```bash
node <skill-dir>/scripts/init-mintlify.mjs --root . --title "我的 Wiki" --color "#0D9373"
```

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--root <dir>` | 目标仓库根目录 | `cwd` |
| `--skill-dir <dir>` | codebase-wiki skill 目录 | 脚本上级目录 |
| `--title <string>` | Wiki 标题 | `Codebase Wiki` |
| `--color <hex>` | 主题主色调 | `#0D9373` |
| `--force` | 覆盖已有文件 | `false` |

### 安装与预览

```bash
npm i -g mint
cd codebase-wiki && mint dev
```

### 文档变更后重建导航

```bash
node <skill-dir>/scripts/regenerate-navigation.mjs --root .
```

---

## Starlight（Astro）

### 初始化

```bash
node <skill-dir>/scripts/init-starlight.mjs --root . --title "我的 Wiki"
```

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--root <dir>` | 目标仓库根目录 | `cwd` |
| `--skill-dir <dir>` | codebase-wiki skill 目录 | 脚本上级目录 |
| `--title <string>` | Wiki 标题 | `Codebase Wiki` |
| `--github <url>` | GitHub 仓库 URL（用于社交链接） | 空 |
| `--force` | 覆盖已有文件 | `false` |

### 安装与预览

```bash
pnpm install
pnpm run docs:wiki:dev
```

### 文档变更后重建侧栏

```bash
node <skill-dir>/scripts/regenerate-starlight-sidebar.mjs --root .
```

### 注意事项

- Starlight 使用 Astro 内容集合，内容目录为 `src/content/docs/`（而非 `codebase-wiki/`）
- 文档按 `architecture/`、`discussion/`、`issue/`、`reference/`、`roadmap/` 子目录组织
- 侧栏配置生成到 `.starlight/sidebar.generated.mjs`，由 `astro.config.mjs` 导入
- 支持 `.md` 和 `.mdx` 格式
