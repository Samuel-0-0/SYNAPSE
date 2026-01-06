export const cpuStyles = `
/* CPU 核心视图 */
.cpu-grid { display: flex; gap: 8px; background: rgba(0,0,0,0.4); padding: 15px; border-radius: 4px; border: 1px solid #111; margin-bottom: 15px; }
.core-slot { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.bar-bg { width: 100%; height: 8px; background: #000; border-radius: 4px; overflow: hidden; }
.bar-fill { height: 100%; width: 0%; transition: 0.6s; }

/* 配置建议区 */
.cfg-box { background: rgba(0,0,0,0.6); padding: 20px; margin-top: 15px; border-left: 3px solid var(--neon); font-size: 14px; }
.cfg-line { margin: 6px 0; color: #ccc; }
.cfg-val { color: var(--success); font-weight: bold; }
.cfg-com { color: #555; font-style: italic; margin-left: 10px; }
`;

export const cpuPanelHTML = `
<div class="panel-title"><span>CPU 异构核心分配视图</span><span id="cpu-strat" style="font-size: 12px; opacity: 0.5;">--</span></div>
<div id="cpu-grid" class="cpu-grid"></div>
<div id="cpu-model" style="font-size: 18px; color:#fff; margin: 15px 0 10px 0;">等待核心数据...</div>
<div id="cpu-audit">
    <div id="tag-aff" class="tag">亲和度: --</div>
    <div id="tag-nice" class="tag">优先级: --</div>
</div>
<div id="cpu-guide" style="display:none;">
    <div style="color:var(--warn); font-size: 14px; margin-top:15px; font-weight:bold;">⚡ 调度建议：Klipper 核心服务应锁定在高性能核心上</div>
    <div class="cfg-box">
        <div class="cfg-line">● /etc/systemd/system/klipper.service</div>
        <div class="cfg-line" style="padding-left:20px;">[Service]</div>
        <div class="cfg-line" style="padding-left:20px;"><span class="cfg-val">CPUAffinity=<span id="cfg-aff-val"></span></span> <span class="cfg-com"># 绑定至识别的大核</span></div>
        <div class="cfg-line" style="padding-left:20px;"><span class="cfg-val">Nice=-20</span> <span class="cfg-com"># 抢占式优先级</span></div>
        <div class="cfg-line" style="margin-top:10px;">● moonraker.service / crowsnest.service</div>
        <div class="cfg-line" style="padding-left:20px;"><span class="cfg-val">CPUAffinity=<span id="cfg-other-val"></span></span> <span class="cfg-com"># 移至能效核，避免干扰</span></div>
    </div>
</div>
`;

export function handleCpuData(data) {
    document.getElementById('cpu-model').innerText = data.model;
    document.getElementById('cpu-strat').innerText = `架构模式: ${data.strategy}`;
    document.getElementById('cpu-grid').innerHTML = data.usage.map((val, i) => {
        const isBig = data.big_cores.includes(i);
        return `<div class="core-slot">
            <div style="font-size:14px; font-weight:bold; color:${isBig?'var(--neon)':'#a020f0'}">${val}%</div>
            <div class="bar-bg"><div class="bar-fill" style="width:${val}%; background:${isBig?'var(--neon)':'#a020f0'}"></div></div>
            <div style="font-size:11px; opacity:0.5;">Core ${i}</div>
        </div>`;
    }).join('');
    document.getElementById('tag-aff').innerText = `亲和度: ${data.config.affinity}`;
    document.getElementById('tag-aff').className = 'tag ' + (data.config.affinity !== '未设置' ? 'tag-ok' : 'tag-warn');
    document.getElementById('tag-nice').innerText = `调度优先级: ${data.config.nice}`;
    document.getElementById('tag-nice').className = 'tag ' + (data.config.nice === '-20' ? 'tag-ok' : 'tag-warn');
    document.getElementById('cfg-aff-val').innerText = data.recommend.klipper;
    document.getElementById('cfg-other-val').innerText = data.recommend.other;
    document.getElementById('cpu-guide').style.display = data.config.is_optimized ? 'none' : 'block';
}