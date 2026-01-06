import { sendMessage } from '../core/ws-manager.js';

export const canStyles = ``;

export const canPanelHTML = `
<div class="panel-title">CANBus 自动化环境配置</div>
<div id="can-status-box" style="font-size:12px; margin-bottom:15px; border:1px dashed var(--neon); padding:10px;"></div>
<div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
    <div>
        <label for="can-pwd" style="font-size:11px;">ROOT 密码 (Sudo):</label>
        <input type="password" id="can-pwd" placeholder="写入配置必需">
        <div id="pwd-err" class="error-hint"></div>
    </div>
    <div>
        <label for="can-ifname" style="font-size:11px;">CAN 接口名称:</label>
        <input type="text" id="can-ifname" value="can0">
    </div>
</div>
<div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
    <div>
        <label for="can-br" style="font-size:11px;">Bitrate (bps):</label>
        <select id="can-br"><option value="1000000">1000000 (1M)</option><option value="500000">500000 (500K)</option></select>
    </div>
    <div>
        <label for="can-tx" style="font-size:11px;">txqueuelen:</label>
        <select id="can-tx"><option value="1024">1024 (无脑使用)</option><option value="512">512 (减少TTC)</option><option value="256">256 (社区推荐)</option><option value="128">128 (Klipper建议值)</option></select>
    </div>
</div>
<div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:10px;">
    <button class="btn" onclick="applyCan()">[ 保存配置 ]</button>
    <button class="btn" style="border-color:var(--warn); color:var(--warn);" onclick="restartCan()">[ 重启网络 ]</button>
</div>
<div class="log-terminal" id="can-terminal">终端就绪</div>
`;

export function applyCan() {
    const pwd = document.getElementById('can-pwd').value;
    if(!pwd) { document.getElementById('pwd-err').innerText = "需要 Root 授权"; return; }
    document.getElementById('pwd-err').innerText = "";
    sendMessage('can_apply', {
        pwd, ifname: document.getElementById('can-ifname').value, 
        bitrate: document.getElementById('can-br').value, txlen: document.getElementById('can-tx').value
    });
}

export function restartCan() {
    const pwd = document.getElementById('can-pwd').value;
    if(!pwd) { document.getElementById('pwd-err').innerText = "需要 Root 授权"; return; }
    sendMessage('can_restart', { pwd });
}

export function handleCanStatus(data) {
    document.getElementById('can-status-box').innerHTML = `管理模式: ${data.mode} | 内核模块: ${data.kernel_can}<br>接口状态: ${data.interfaces}`;
}

export function handleCanLog(data) {
    const term = document.getElementById('can-terminal');
    term.innerHTML += `\n[${new Date().toLocaleTimeString()}] ${data}`;
    term.scrollTop = term.scrollHeight;
}

// 导出函数到全局
window.applyCan = applyCan;
window.restartCan = restartCan;