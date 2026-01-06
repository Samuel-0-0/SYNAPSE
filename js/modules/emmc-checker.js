export const emmcStyles = `
/* eMMC 进度条样式 */
.emmc-bar-container { height: 10px; background: #000; margin-top: 10px; border: 1px solid #333; }
.emmc-bar-fill { height: 100%; width: 0%; background: var(--success); transition: 1s; }
`;

export const emmcPanelHTML = `
<div class="panel-title"><span>eMMC 存储健康状态</span></div>
<div style="display:flex; justify-content:space-between; font-size:14px;"><span>芯片预估寿命</span><span id="emmc-pct">--</span></div>
<div class="emmc-bar-container"><div id="emmc-fill" class="emmc-bar-fill"></div></div>
<div id="emmc-msg" style="margin-top:10px; font-size:12px; color:#666;">--</div>
`;

export function handleEmmcData(data) {
    document.getElementById('emmc-pct').innerText = data.mlc + "%";
    document.getElementById('emmc-fill').style.width = data.mlc + "%";
    document.getElementById('emmc-msg').innerText = `节点: ${data.device} | ${data.msg}`;
}