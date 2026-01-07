# SYNAPSE 插件开发手册

## 概述

本手册将指导您如何为 SYNAPSE 添加新的插件功能。

## 插件系统架构

SYNAPSE 采用前后端分离的模块化架构：

- **后端**: FastAPI 服务器，提供 REST API 和 WebSocket 通信
- **前端**: 基于 ES6 Modules 的模块化 JavaScript 应用
- **通信**: 通过 WebSocket 进行实时双向通信

### 现有插件结构

```
js/modules/
├── cpu-checker.js      # CPU 核心检查
├── usb-checker.js      # USB 拓扑分析
├── emmc-checker.js     # eMMC 寿命检查
├── can-config.js       # CANBus 配置
└── git-backup.js       # GitHub 云备份
```

## 添加新插件的步骤

### 步骤 1: 设计插件功能

在开始开发前，请明确：
- 插件的名称和功能描述
- 需要收集哪些数据
- UI 界面需要显示哪些信息
- 是否需要用户交互（按钮、表单等）

### 步骤 2: 后端开发

#### 2.1 创建处理函数

在 `synapse.py` 中的 `DiagnosticTool` 类中添加新的静态方法：

```python
@staticmethod
def get_new_feature():
    # 实现您的功能逻辑
    # 返回数据字典
    return {
        "key1": "value1",
        "key2": "value2"
    }
```

#### 2.2 添加 WebSocket Action

在 WebSocket 处理器中添加新的 action 分支：

```python
elif action == "new_feature":
    await websocket.send_json({"type": "new_feature", "data": DiagnosticTool.get_new_feature()})
```

如果需要参数处理：

```python
elif action == "new_feature_action":
    param1 = params.get("param1")
    param2 = params.get("param2")
    result = DiagnosticTool.process_new_feature(param1, param2)
    await websocket.send_json({"type": "new_feature_result", "data": result})
```

### 步骤 3: 前端开发

#### 3.1 创建插件模块文件

在 `js/modules/` 目录下创建新的 JavaScript 模块文件 `new-feature.js`：

```javascript
// 插件样式
export const newFeatureStyles = `
/* 您的自定义样式 */
.new-feature-panel {
    background: rgba(0,0,0,0.4);
    padding: 15px;
    border-radius: 4px;
    border: 1px solid #111;
}
`;

// 插件 HTML 模板
export const newFeaturePanelHTML = `
<div class="panel-title">新功能标题</div>
<div id="new-feature-content" class="new-feature-panel">
    <!-- 您的 HTML 内容 -->
    <div id="feature-data">等待数据...</div>
    <button class="btn" onclick="sendNewFeatureRequest()">执行操作</button>
</div>
`;

// 数据处理函数
export function handleNewFeatureData(data) {
    // 处理从后端接收的数据
    document.getElementById('feature-data').innerText = JSON.stringify(data, null, 2);
}

```

#### 3.2 在主应用中注册插件

编辑 `js/core/app.js`：

1. 添加导入语句：
```javascript
import { handleNewFeatureData, handleNewFeatureResult, newFeaturePanelHTML, newFeatureStyles } from '../modules/new-feature.js';
```

2. 在 `handleData` 函数中添加数据处理器：
```javascript
function handleData(res) {
    // ... 现有代码 ...
    } else if(res.type === 'new_feature') {
        handleNewFeatureData(res.data);
    } else if(res.type === 'new_feature_result') {
        handleNewFeatureResult(res.data);
    }
}
```

3. 在样式注入中添加插件样式：
```javascript
const moduleStyles = ... + newFeatureStyles;
```

4. 在面板初始化中添加插件 HTML：
```javascript
document.getElementById('panel-new-feature').innerHTML = newFeaturePanelHTML;
```

#### 3.3 添加前端交互函数

如果需要发送 WebSocket 消息，在 `js/core/ws-manager.js` 中添加函数，或在插件模块中直接使用：

```javascript
import { sendMessage } from '../core/ws-manager.js';

function sendNewFeatureRequest() {
    sendMessage({
        action: "new_feature_action",
        params: {
            param1: "value1",
            param2: "value2"
        }
    });
}

// 导出函数供 HTML 调用
window.sendNewFeatureRequest = sendNewFeatureRequest;
```

### 步骤 4: 更新界面

#### 4.1 添加侧边栏按钮

在 `index.html` 中添加新的按钮：

```html
<button class="btn" id="btn-new-feature" onclick="openPanel('new-feature')">新功能名称</button>
```

#### 4.2 添加面板容器

在主视图中添加面板 div：

```html
<div class="panel" id="panel-new-feature"></div>
```

### 步骤 5: 测试和调试

1. 重启后端服务
2. 刷新浏览器页面
3. 测试插件功能是否正常工作
4. 检查浏览器控制台是否有错误信息
5. 验证 WebSocket 通信是否正常

## 最佳实践

### 代码规范

- 使用 ES6 模块语法
- 遵循现有的命名约定
- 添加适当的错误处理
- 为函数和变量添加注释

### UI 设计

- 保持与现有插件一致的视觉风格
- 使用 CSS 变量（定义在 `css/styles.css` 中）
- 响应式设计，支持移动设备
- 提供清晰的用户反馈

### 性能考虑

- 避免阻塞操作
- 合理使用 WebSocket 通信频率
- 优化数据结构大小
- 考虑内存使用

### 安全性

- 验证用户输入
- 避免执行危险的系统命令
- 适当处理错误信息
- 不暴露敏感信息

## 示例：添加温度监控插件

让我们通过一个具体的例子来演示如何添加温度监控插件。

### 后端实现

在 `synapse.py` 中添加：

```python
@staticmethod
def get_temperature():
    try:
        # 获取 CPU 温度
        cpu_temp = DiagnosticTool.run_cmd("cat /sys/class/thermal/thermal_zone0/temp")
        cpu_temp_c = int(cpu_temp) / 1000
        
        # 获取其他温度传感器（如果有）
        gpu_temp = DiagnosticTool.run_cmd("vcgencmd measure_temp 2>/dev/null | cut -d'=' -f2 | cut -d\"'\" -f1") or "N/A"
        
        return {
            "cpu": cpu_temp_c,
            "gpu": gpu_temp,
            "status": "正常" if cpu_temp_c < 80 else "高温警告"
        }
    except Exception as e:
        return {"error": str(e)}
```

在 WebSocket 处理器中添加：

```python
elif action == "temperature":
    await websocket.send_json({"type": "temperature", "data": DiagnosticTool.get_temperature()})
```

### 前端实现

创建 `js/modules/temperature-monitor.js`：

```javascript
export const temperatureStyles = `
.temperature-panel {
    background: rgba(0,0,0,0.4);
    padding: 15px;
    border-radius: 4px;
    border: 1px solid #111;
}
.temp-item {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    padding: 8px;
    background: rgba(255,255,255,0.05);
    border-radius: 4px;
}
.temp-value {
    font-weight: bold;
    color: var(--neon);
}
.temp-warning {
    color: var(--danger);
}
`;

export const temperaturePanelHTML = `
<div class="panel-title">温度监控</div>
<div id="temperature-content" class="temperature-panel">
    <div id="temp-cpu" class="temp-item">
        <span>CPU 温度:</span>
        <span id="cpu-temp" class="temp-value">--°C</span>
    </div>
    <div id="temp-gpu" class="temp-item">
        <span>GPU 温度:</span>
        <span id="gpu-temp" class="temp-value">--°C</span>
    </div>
    <div id="temp-status" class="temp-item">
        <span>状态:</span>
        <span id="status-text">检测中...</span>
    </div>
    <button class="btn" onclick="refreshTemperature()">刷新</button>
</div>
`;

export function handleTemperatureData(data) {
    if (data.error) {
        document.getElementById('status-text').innerText = `错误: ${data.error}`;
        return;
    }
    
    document.getElementById('cpu-temp').innerText = `${data.cpu}°C`;
    document.getElementById('gpu-temp').innerText = data.gpu !== "N/A" ? `${data.gpu}°C` : "N/A";
    
    const statusEl = document.getElementById('status-text');
    statusEl.innerText = data.status;
    statusEl.className = data.status.includes('警告') ? 'temp-warning' : '';
}

function refreshTemperature() {
    import('../core/ws-manager.js').then(({ sendMessage }) => {
        sendMessage({ action: "temperature" });
    });
}

window.refreshTemperature = refreshTemperature;
```

然后按照步骤 3.2 在 `app.js` 中注册这个插件，并在 `index.html` 中添加相应的按钮和面板。

## 故障排除

### 常见问题

1. **插件不显示**: 检查 HTML 中是否正确添加了面板容器
2. **WebSocket 通信失败**: 确认后端 action 名称与前端发送的 action 匹配
3. **样式不生效**: 确保在 `app.js` 中正确注入了插件样式
4. **函数未定义**: 检查导入语句和导出语句是否正确

### 调试技巧

- 使用浏览器开发者工具查看 WebSocket 消息
- 在后端添加日志输出
- 检查浏览器控制台错误信息
- 验证数据格式是否正确

## 贡献指南

如果您开发了有用的插件，欢迎提交 Pull Request：

1. 确保代码符合项目规范
2. 添加适当的文档和注释
3. 测试功能在不同环境下的兼容性
4. 更新本手册的示例部分

---

*本文档版本: 1.0*
*最后更新: 2025年1月7日*</content>