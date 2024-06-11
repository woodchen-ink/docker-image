# Docker-Image

运行于 cloudflare workers 上的 Docker 镜像加速工具，用于解决获取 Docker 官方镜像无法正常访问的问题。

修改自：[https://github.com/tomwei7/hammal](https://github.com/tomwei7/hammal)

## 使用说明

### Fork & Clone

首先 fork 仓库 [Docker-Image](https://github.com/woodchen/docker-image) ，并克隆到本地

> 可以的话顺便给个 Star😂

使用 `pnpm install` 安装依赖

### 创建 Workers 项目

进入 [Cloudflare Dashboard](https://dash.cloudflare.com/ "https://dash.cloudflare.com/") 创建一个新的 Workers 项目，给他一个命名（例如 `docker-image`）

复制 `wrangler.toml.sample` 文件改名 `wrangler.toml` 并修改其 `name` 和 `account_id`

account\_id 可以通过 `npx wrangler whoami` 获得，也可以从 CF Workers Dashboard 右侧获得

### 创建 cache 缓存 kv

在克隆好的项目目录下执行 `npx wrangler kv:namespace create hammal_cache` 来创建缓存 kv，记录下来输出的 id，填写到 `wrangler.toml` 文件中

### Deploy

在克隆好的项目目录下执行 `pnpm run deploy` 来部署项目

进入你的 Workers 脚本的 dashboard，为它绑定一个自定义域名（必要，因为默认的 `workers.dev` 域名被墙了）

### 访问

直接访问自己绑定的域名就知道怎么用了
