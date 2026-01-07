# SYNAPSE

理想：

一个现代化的管理界面，提供直观的 Web 控制面板来监控和配置基于 Klipper 的 3D 打印机系统。

## 功能特性

- **实时连接监控**: 通过 WebSocket 建立与后端的连接
- **系统诊断工具**:
  - CPU 核心状态检查
  - USB 设备拓扑分析
  - eMMC 存储寿命评估
  - CANBus 网络配置
- **云备份集成**: GitHub 仓库自动备份功能
- **响应式设计**: 自适应布局，支持各种屏幕尺寸
- **模块化架构**: 易于扩展的新功能插件

## 技术栈

- **前端**: HTML5, CSS3, ES6 Modules
- **后端**: FastAPI (Python)
- **通信**: WebSocket
- **样式**: 自定义 CSS 变量，霓虹风格主题

## 安装和运行

### 前提条件

- Python 3.8+

### 安装和运行

1. 使用下面的命令：

   ```注：第一次使用会执行安装步骤，系统重启后执行命令则直接启动服务端```

   ```bash
   curl -sSL https://raw.githubusercontent.com/Samuel-0-0/SYNAPSE/main/synapse.sh | bash
   ```

2. 服务启动后将提供一个访问地址，通过浏览器访问


## 使用指南

1. **建立连接**:
   - 在左侧输入目标设备的 IP 地址（默认已经是当前设备的IP）
   - 点击"建立隧道连接"按钮
   - 等待右上角连接状态变为 "LINK: ONLINE"

2. **使用功能面板**:
   - 点击左侧导航按钮切换到相应功能
   - 每个面板会显示数据和配置选项

3. **故障排除**:
   - 如果连接失败，检查 IP 地址和网络连接
   - 确保后端服务在目标设备上运行

## 添加插件功能

项目采用模块化设计，易于添加新功能。每个插件包含 HTML 模板、CSS 样式和 JavaScript 逻辑。</br>
具体步骤请参考[SYNAPSE 插件开发手册](/PLUGIN_DEVELOPMENT_GUIDE.md)

## 项目结构

```
SYNAPSE/
├── synapse.py                   # FastAPI 后端服务器
├── index.html                   # 主页面
├── css/
│   └── styles.css               # CSS 样式
├── js/
│   ├── core/
│   │   ├── app.js               # 应用初始化
│   │   ├── router.js            # 面板路由管理
│   │   └── ws-manager.js        # WebSocket 连接管理
│   └── modules/                 # 功能插件
│       ├── cpu-checker.js       # CPU 核心检查
│       ├── usb-checker.js       # USB 拓扑分析
│       ├── emmc-checker.js      # eMMC 寿命检查
│       ├── can-config.js        # CANBus 配置
│       └── git-backup.js        # GitHub 云备份
├── synapse.sh                   # 安装/启动脚本
├── VERSION                      # 定义版本号
├── PLUGIN_DEVELOPMENT_GUIDE.md  # 插件开发手册
└── README.md                    # 说明文档
```

## 自定义主题

可以通过修改 `css/styles.css` 中的 CSS 变量来自定义颜色和样式：

```css
:root {
    --bg: #000000;
    --neon: #00f3ff;
    --panel-bg: rgba(0, 0, 0, 0.8);
    --success: #00ff00;
    --warn: #ffff00;
    --danger: #ff0000;
}
```

## 故障排除

### 常见问题

1. **连接失败**:
   - 检查 IP 地址是否正确
   - 确保防火墙允许 WebSocket 连接
   - 验证后端服务状态

2. **字体加载问题**:
   - 项目已使用 Google Fonts 的代理链接

3. **模块加载错误**:
   - 确保所有依赖文件存在
   - 检查浏览器控制台的错误信息

## 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。

## 许可证

本项目采用 GNU General Public License v3.0 许可证。