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

1. 使用下面的链接直接安装：
   ```bash
   curl -sSL https://raw.githubusercontent.com/Samuel-0-0/SYNAPSE/main/start.sh | bash
   ```

2. 服务启动后将提供一个访问地址，通过浏览器访问


## 使用指南

1. **建立连接**:
   - 在左侧输入目标设备的 IP 地址
   - 点击"建立隧道连接"按钮
   - 等待连接状态变为 "LINK: ONLINE"

2. **使用功能面板**:
   - 点击左侧导航按钮切换到相应功能
   - 每个面板会显示实时数据和配置选项

3. **故障排除**:
   - 如果连接失败，检查 IP 地址和网络连接
   - 确保后端服务在目标设备上运行

## 添加插件功能

项目采用模块化设计，易于添加新功能。每个插件包含 HTML 模板、CSS 样式和 JavaScript 逻辑。

### 创建新插件步骤：

1. **创建模块文件**:
   在 `js/modules/` 目录下创建新文件，例如 `new-feature.js`

2. **实现插件结构**:
   ```javascript
   // 导出 HTML 模板
   export const newFeaturePanelHTML = `
   <div class="panel-title">新功能标题</div>
   <div class="content">
       <!-- 插件内容 -->
   </div>
   `;

   // 导出 CSS 样式
   export const newFeatureStyles = `
   .new-feature-class {
       /* 样式定义 */
   }
   `;

   // 导出数据处理函数
   export function handleNewFeatureData(data) {
       // 处理从后端接收的数据
       document.getElementById('new-feature-element').textContent = data.value;
   }
   ```

3. **注册插件**:
   在 `js/core/app.js` 中导入并注册：
   ```javascript
   import { handleNewFeatureData, newFeaturePanelHTML, newFeatureStyles } from '../modules/new-feature.js';

   // 在 handleData 函数中添加处理逻辑
   if(res.type === 'new_feature') {
       handleNewFeatureData(res.data);
   }

   // 在初始化时注入样式和 HTML
   const moduleStyles = ... + newFeatureStyles;
   document.getElementById('panel-new-feature').innerHTML = newFeaturePanelHTML;
   ```

4. **添加导航按钮**:
   在 `index.html` 的 sidebar 中添加按钮：
   ```html
   <button class="btn" id="btn-new-feature" onclick="openPanel('new-feature')">新功能</button>
   ```

5. **添加面板容器**:
   在 main-view 中添加面板 div：
   ```html
   <div class="panel" id="panel-new-feature"></div>
   ```

6. **后端支持**:
   在 `app.py` 中添加相应的 WebSocket 消息处理和数据收集逻辑。

### 插件开发最佳实践

- 使用 ES6 模块保持代码组织
- 遵循现有的命名约定
- 为新功能添加适当的错误处理
- 确保样式与整体主题一致
- 测试在不同屏幕尺寸下的响应性

## 项目结构

```
SYNAPSE/
├── app.py                 # FastAPI 后端服务器
├── index.html             # 主页面
├── css/
│   ├── theme.css          # CSS 变量和主题
│   └── styles.css         # 组件样式
├── js/
│   ├── core/
│   │   ├── app.js         # 应用初始化
│   │   ├── router.js      # 面板路由管理
│   │   └── ws-manager.js  # WebSocket 连接管理
│   └── modules/           # 功能插件
│       ├── cpu-checker.js
│       ├── usb-checker.js
│       ├── emmc-checker.js
│       ├── can-config.js
│       └── git-backup.js
└── README.md
```

## 自定义主题

可以通过修改 `css/theme.css` 中的 CSS 变量来自定义颜色和样式：

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