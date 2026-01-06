#!/bin/bash

export LANG=C.UTF-8
export LC_ALL=C.UTF-8

# 1. 自动获取当前用户名和路径
USER=$(whoami)
BACKEND_DIR="/home/$USER/synapse"

# 探测 Web 目录
if [ -d "/home/$USER/mainsail" ]; then
    WEB_PATH="/home/$USER/mainsail"
elif [ -d "/home/$USER/fluidd" ]; then
    WEB_PATH="/home/$USER/fluidd"
else
    echo "▶ 未找到 Web 根目录。"
    exit 1
fi

FRONTEND_DIR="$WEB_PATH/synapse"
HTML_NAME="index.html"
PY_NAME="synapse.py"
REPO_URL="https://github.com/Samuel-0-0/SYNAPSE.git"

# 自动获取本机局域网 IP
HOST_IP=$(hostname -I | awk '{print $1}')

if [ -z "$HOST_IP" ]; then
    echo "▶ 无法检测到设备 IP，请检查网络连接。"
    exit 1
fi

# 2. 检查版本并决定是否更新
UPDATE_NEEDED=false

if [ -f "$BACKEND_DIR/VERSION" ] && [ -d "$FRONTEND_DIR" ]; then
    echo "▶ 检查本地版本..."
    LOCAL_VERSION=$(cat "$BACKEND_DIR/VERSION" 2>/dev/null)
    REMOTE_VERSION=$(curl -s "https://raw.githubusercontent.com/Samuel-0-0/SYNAPSE/main/VERSION")
    
    if [ "$LOCAL_VERSION" != "$REMOTE_VERSION" ]; then
        echo "▶ 本地版本与远程版本不一致，需要更新。"
        UPDATE_NEEDED=true
    else
        echo "▶ 本地版本与远程版本一致，无需更新。"
    fi
else
    echo "▶ 本地文件或目录不存在，需要下载。"
    UPDATE_NEEDED=true
fi

# 3. 如果需要更新，执行安装步骤
if [ "$UPDATE_NEEDED" = true ]; then
    # 依赖环境检查与安装 (优化：先检查后安装)
    echo "▶ 正在检查 Python 依赖库..."

    # 定义需要检查的依赖列表
    DEPENDENCIES=("fastapi" "uvicorn" "psutil" "websockets")

    for pkg in "${DEPENDENCIES[@]}"; do
        # 尝试导入库来验证其在当前 python3 环境中是否真正可用
        if python3 -c "import $pkg" > /dev/null 2>&1; then
            echo "  $pkg 已就绪。"
        else
            echo "  $pkg 不可用，正在尝试安装..."
            # 强制安装到当前用户环境，并确保安装 uvicorn[standard]
            if [ "$pkg" == "uvicorn" ] || [ "$pkg" == "websockets" ]; then
                python3 -m pip install --user "uvicorn[standard]" websockets
            else
                python3 -m pip install --user "$pkg"
            fi
        fi
    done

    # 创建目录并下载文件
    mkdir -p "$BACKEND_DIR"
    mkdir -p "$FRONTEND_DIR"

    echo "▶ 正在从 GitHub 下载..."
    cd /tmp
    rm -rf temp_synapse
    git clone "$REPO_URL" temp_synapse > /dev/null 2>&1
    cp "temp_synapse/$PY_NAME" "$BACKEND_DIR/$PY_NAME"
    cp "temp_synapse/VERSION" "$BACKEND_DIR/VERSION"
    cp -r "temp_synapse/index.html" "temp_synapse/css" "temp_synapse/js" "$FRONTEND_DIR/"
    rm -rf temp_synapse

    # 修改 HTML 中的默认 IP 为本机探测到的 IP
    sed -i "s/value=\"192.168.88.20\"/value=\"$HOST_IP\"/g" "$FRONTEND_DIR/$HTML_NAME"
fi

# 4. 后台启动服务
echo "▶ 前端目录: $FRONTEND_DIR"
echo "▶ 后端目录: $BACKEND_DIR"
echo "▶ 正在启动服务..."
chmod +x "$BACKEND_DIR/$PY_NAME"
# 杀掉旧进程
pkill -f "$PY_NAME" > /dev/null 2>&1

# 使用 nohup 后台运行并确保进程在 Shell 退出后不中断
nohup python3 "$BACKEND_DIR/$PY_NAME" > /tmp/synapse.log 2>&1 &

# 5. 最终提醒
echo "===================================================="
echo "▶ 部署成功！"
echo "▶ 请访问: http://$HOST_IP/synapse/index.html"
echo "▶ 日志查看: tail -f /tmp/synapse.log"
echo "▶ 系统重启后服务将会自动停止"
echo "===================================================="