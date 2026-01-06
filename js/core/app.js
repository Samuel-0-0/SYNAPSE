// 主应用初始化
import { connect, setOnMessageCallback, setOnConnectCallback, sendMessage } from './ws-manager.js';
import { openPanel } from './router.js';
import { handleCpuData, cpuPanelHTML, cpuStyles } from '../modules/cpu-checker.js';
import { handleEmmcData, emmcPanelHTML, emmcStyles } from '../modules/emmc-checker.js';
import { handleUsbData, usbPanelHTML, usbStyles } from '../modules/usb-checker.js';
import { handleCanStatus, handleCanLog, canPanelHTML, canStyles } from '../modules/can-config.js';
import { handleGitLog, gitPanelHTML, gitStyles } from '../modules/git-backup.js';

const welcomePanelHTML = `
<div style="font-size: 40px; margin-bottom: 20px;">⚡</div>
<div id="welcome-text" class="blink">请先建立隧道连接，然后点击左侧需要的功能</div>
`;

function handleData(res) {
    if(res.type === 'cpu') {
        handleCpuData(res.data);
    } else if(res.type === 'emmc') {
        handleEmmcData(res.data);
    } else if(res.type === 'usb') {
        handleUsbData(res.data);
    } else if(res.type === 'can_status') {
        handleCanStatus(res.data);
    } else if(res.type === 'can_log') {
        handleCanLog(res.data);
    } else if(res.type === 'git_log') {
        handleGitLog(res.data);
    }
}

setOnMessageCallback(handleData);

setOnConnectCallback(() => {
    document.getElementById('welcome-text').innerText = '点击左侧的按钮使用相应的功能';
    document.getElementById('welcome-text').classList.remove('blink');
});

// 注入模块特定样式
const moduleStyles = cpuStyles + usbStyles + emmcStyles + canStyles + gitStyles;
document.head.insertAdjacentHTML('beforeend', `<style>${moduleStyles}</style>`);

// 初始化面板
document.getElementById('welcome-panel').innerHTML = welcomePanelHTML;
document.getElementById('panel-cpu').innerHTML = cpuPanelHTML;
document.getElementById('panel-usb').innerHTML = usbPanelHTML;
document.getElementById('panel-emmc').innerHTML = emmcPanelHTML;
document.getElementById('panel-can').innerHTML = canPanelHTML;
document.getElementById('panel-git').innerHTML = gitPanelHTML;

// 为欢迎面板添加动画
setTimeout(() => document.getElementById('welcome-panel').classList.add('fade-in'), 100);

// 全局变量
window.connect = connect;
window.openPanel = openPanel;