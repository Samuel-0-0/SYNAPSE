import { isConnected, sendMessage } from './ws-manager.js';

export function openPanel(name) {
    if(!isConnected()) { 
        document.getElementById('connect-btn').classList.add('blink');
        document.getElementById('side-err').innerText = ""; // 清除错误文本
        return; 
    }
    document.querySelectorAll('.panel').forEach(p => {
        p.style.display = 'none';
        p.classList.remove('fade-in');
    });
    // 移除所有按钮的 active 类
    document.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
    // 添加当前按钮的 active 类
    const btn = document.getElementById('btn-' + name);
    if (btn) btn.classList.add('active');
    const target = document.getElementById('panel-' + name);
    target.style.display = 'block';
    // 小延迟以确保 display:block 生效，然后添加动画类
    setTimeout(() => target.classList.add('fade-in'), 10);
    if(name === 'can') sendMessage('can_status');
    else sendMessage(name);
}