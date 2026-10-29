# 钢铁雄心4 指令台（HOI4 Console Command Helper）

用中文自然语言查询 / 浏览《钢铁雄心4》全部控制台指令，一键复制可直接粘贴进游戏的代码。

## 功能
- 中文需求 → 控制台指令（如「给伊朗10000个钢」→ `add_resources PER 10000 steel`、`吞并日本` → `annex JAP`）
- 指令大全分类浏览 + 搜索
- 纯静态站点，零依赖、零后端

## 本地直接打开
双击 `index.html` 即可（部分浏览器对本地文件有限制，推荐用下方本地服务器方式）。

```bash
cd 本目录
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

## 部署到 GitHub Pages（固定永久网址）
1. 在 https://github.com 注册账号（免费，约 1 分钟）。
2. 新建一个仓库（建议名 `hoi4-commands`，选 Public）。
3. 把本目录所有文件推上去：
   ```bash
   git init
   git add -A
   git commit -m "init hoi4 commands site"
   git branch -M main
   git remote add origin https://github.com/你的用户名/hoi4-commands.git
   git push -u origin main
   ```
4. 仓库 → Settings → Pages → Source 选 `Deploy from a branch` → 分支选 `main` / 目录选 `/ (root)` → Save。
5. 几分钟后访问：`https://你的用户名.github.io/hoi4-commands`

之后每次改版，只需 `git add -A && git commit -m "更新" && git push`，网址不变、内容自动更新。

> 注意根目录的 `.nojekyll` 不要删，它让 GitHub 正确提供 `_` 开头的目录与静态资源。
