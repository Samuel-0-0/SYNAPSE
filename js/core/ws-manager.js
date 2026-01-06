let ws;
let onMessageCallback = null;
let onConnectCallback = null;

export function setOnMessageCallback(callback) {
    onMessageCallback = callback;
}

export function setOnConnectCallback(callback) {
    onConnectCallback = callback;
}

export function connect() {
    const ip = document.getElementById('ip').value;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${protocol}//${ip}:1111/ws`);
    ws.onopen = () => { 
        document.getElementById('connection-status').innerText = "LINK: ONLINE"; 
        document.getElementById('connection-status').style.color = "var(--success)"; 
        document.getElementById('side-err').innerText = ""; 
        document.getElementById('connect-btn').classList.remove('blink'); // 移除闪烁
        if (onConnectCallback) {
            onConnectCallback();
        }
    };
    ws.onmessage = (e) => {
        if (onMessageCallback) {
            onMessageCallback(JSON.parse(e.data));
        }
    };
}

export function isConnected() {
    return ws && ws.readyState === 1;
}

export function sendMessage(action, params = {}) {
    if(ws && ws.readyState === 1) {
        ws.send(JSON.stringify({action, params}));
    }
}