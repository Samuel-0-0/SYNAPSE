export const usbStyles = `
/* USB 树形 - 备注+SN+评分逻辑 */
.tree-node { margin: 8px 0; padding-left: 20px; border-left: 1px dashed rgba(0, 243, 255, 0.2); }
.node-row { display: flex; align-items: center; gap: 10px; font-size: 14px; }
.fw-badge { font-size: 11px; padding: 1px 5px; border-radius: 2px; font-weight: bold; color: #000; }
.fw-KLIPPER { background: var(--success); }
.fw-KATAPULT { background: var(--warn); }
.fw-CAN_ADAPTER { background: var(--neon); }
.fw-DFU { background: var(--danger); }
.sn-tag { font-size: 12px; color: #666; background: rgba(255,255,255,0.05); padding: 2px 6px; }
`;

export const usbPanelHTML = `
<div class="panel-title"><span>USB 通讯链拓扑</span></div>
<div id="usb-tree">等待指令...</div>
`;

export function handleUsbData(data) {
    const buildTree = (nodes, pid) => {
        return nodes.filter(n => n.pid === pid).map(n => `
            <div class="tree-node">
                <div class="node-row">
                    <span style="border:1px solid var(--neon); font-size:10px; padding:0 4px;">${n.type}</span>
                    <span>${n.name}</span>
                    ${n.fw.map(tag => `<span class="fw-badge fw-${tag}">${tag.replace('_', ' ')}</span>`).join('')}
                    ${n.serial !== 'N/A' ? `<span class="sn-tag">SN: ${n.serial}</span>` : ''}
                    <span style="margin-left:auto; color:${n.score>85?'var(--success)':'var(--danger)'}">${n.score}分</span>
                </div>
                ${buildTree(nodes, n.id)}
            </div>`).join('');
    };
    document.getElementById('usb-tree').innerHTML = buildTree(data.nodes, "1-0");
}