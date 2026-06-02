# 私有云博系统部署指南 (手动部署)

本指南介绍如何在 Linux 服务器 (Ubuntu/Debian) 上手动部署系统，不使用 Docker。

## 1. 环境准备 (Prerequisites)

请在服务器上安装以下基础软件：

### Node.js (v18+)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### PM2 (进程管理)
```bash
sudo npm install -g pm2
```

### PostgreSQL (数据库)
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
# 更改 postgres 用户密码 (需与 .env 一致)
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'your_secure_password';"
# 创建数据库
sudo -u postgres createdb zky_cloud
```

### Redis (缓存)
```bash
sudo apt install redis-server
sudo systemctl start redis-server
```

### Nginx (Web 服务器)
```bash
sudo apt install nginx
```

---

## 2. 后端部署 (Backend)

1.  **上传代码**：将 `backend` 文件夹上传到 `/var/www/zky/backend` (示例路径)。
2.  **安装依赖**：
    ```bash
    cd /var/www/zky/backend
    npm install
    # 如果遇到 bcrypt 编译问题
    npm rebuild bcrypt --build-from-source
    ```
3.  **配置环境**：
    创建 `.env` 文件并填入真实信息：
    ```bash
    cp .env.example .env
    nano .env
    ```
    *确保 `DB_PASSWORD` 与数据库设置一致，`DB_HOST` 为 `localhost`。*

4.  **编译与启动**：
    ```bash
    # 编译 TypeScript
    npm run build
    
    # 使用 PM2 启动
    pm2 start dist/main.js --name "zky-backend"
    
    # 保存 PM2 列表 (开机自启)
    pm2 save
    pm2 startup
    ```

---

## 3. 前端部署 (Frontend)

1.  **本地/服务器编译**：
    建议在本地编译好再上传 `dist` 目录，或者在服务器编译：
    ```bash
    cd /var/www/zky/frontend
    npm install
    npm run build
    ```
    *编译完成后，会生成 `dist` 文件夹。*

2.  **配置 Nginx**：
    创建配置文件 `/etc/nginx/sites-available/zky.conf`：

    ```nginx
    server {
        listen 80;
        server_name your_domain.com;  # 替换为你的域名或 IP

        # 前端静态文件
        location / {
            root /var/www/zky/frontend/dist;
            index index.html;
            try_files $uri $uri/ /index.html;
        }

        # 后端 API 代理
        location /api/ {
            proxy_pass http://localhost:3000/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        
        # WebSocket 代理 (Socket.IO)
        location /socket.io/ {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }
        
        # 附件目录代理 (可选，如果上传文件存放在本地)
        location /uploads/ {
            alias /var/www/zky/backend/uploads/;
            expires 7d;
        }
    }
    ```

3.  **启用配置并重启 Nginx**：
    ```bash
    sudo ln -s /etc/nginx/sites-available/zky.conf /etc/nginx/sites-enabled/
    sudo nginx -t  # 检查配置语法
    sudo systemctl restart nginx
    ```

---

## 4. 验证与维护

- **访问**：浏览器访问 `http://your_server_ip`。
- **查看后端日志**：`pm2 logs zky-backend`
- **更新代码**：
    1. `git pull` (如果使用 git)
    2. 后端：`npm install` -> `npm run build` -> `pm2 restart zky-backend`
    3. 前端：`npm install` -> `npm run build`
