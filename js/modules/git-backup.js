import { sendMessage } from '../core/ws-manager.js';

export const gitStyles = ``;

export const gitPanelHTML = `
<div class="panel-title"><span>GitHub 配置云同步备份</span></div>
<div style="font-size:13px; color:#888; margin-bottom:15px;">
    此操作将备份 <span style="color:var(--neon)">~/printer_data</span> 目录至关联的远程仓库。备份说明会自动附带 Klipper/Moonraker 版本号。
</div>
<div style="display:flex; gap:10px;">
    <input type="text" id="git-msg" placeholder="输入更新说明 (默认: Web Auto Backup)" style="flex:1">
    <button class="btn" style="border-color:var(--success); color:var(--success)" onclick="startBackup()">[ 立即执行备份 ]</button>
</div>
<div class="log-terminal" id="git-terminal">终端就绪，等待指令...</div>
<div class="doc-section">
    <p>新手教程 （注意：以下方法中已标记<span class="user-mark">红色</span>的代码段需替换为你自己的信息）：</p>
    <details>
        <summary>GitHub SSH 密钥配置指南 (初次使用必看)</summary>
        <p>1. 终端执行配置并生成 Key:</p>
        <div class="code-block">
            git config --global user.name "<span class="user-mark">Samuel Wang</span>" && \<br>
            git config --global user.email "<span class="user-mark">imhsaw@gmail.com</span>" && \<br>
            ssh-keygen -t rsa -C "<span class="user-mark">imhsaw@gmail.com</span>" && \<br>
            cat ~/.ssh/id_rsa.pub
        </div>
        <p>2. 复制上方打印的内容。<br>前往 GitHub -> Settings -> SSH and GPG keys -> New SSH Key，粘贴并保存。</p>
    </details>

    <details>
        <summary>第一次备份</summary>
        <p>1. 初始化文件夹（以前没有做过Git备份）:</p>
        <div class="code-block">
            cd ~/printer_data && git init && \<br>
            git branch -m main && \<br>
            git remote add origin git@github.com:<span class="user-mark">Samuel-0-0/Voron_2.4_350_config</span>.git
        </div>
        <p>2. 导入证书:</p>
        <div class="code-block">
            cd ~/printer_data && ssh -T git@github.com
        </div>
        <p>3. 手动执行一次备份:</p>
        <div class="code-block">
            1）git add . -v<br>
            2）git commit -m "first commit"<br>
            3）git push -u origin main<br><br>
        </div>
    </details>

    <details>
        <summary>新系统恢复与迁移配置（已经有远程备份时）</summary>
        <p>1. 恢复备份的 SSH 密钥后执行权限修正:</p>
        <div class="code-block">chmod 600 ~/.ssh/id_rsa && chmod 644 ~/.ssh/id_rsa.pub</div>
        <p>2. 克隆配置并重新关联:</p>
        <div class="code-block">
            1）git clone https://github.com/<span class="user-mark">Samuel-0-0/voron_350_klipper_config</span>.git ~/printer_data<br>
            2）git config --global user.name "<span class="user-mark">Samuel Wang</span>" && git config --global user.email "<span class="user-mark">imhsaw@gmail.com</span>"<br>
            3）cd ~/printer_data && git remote set-url origin git@github.com:<span class="user-mark">Samuel-0-0/Voron_2.4_350_config</span>.git && ssh -T git@github.com
        </div>
    </details>
</div>
`;

export function startBackup() {
    const msg = document.getElementById('git-msg').value || "Web Auto Backup";
    document.getElementById('git-terminal').innerHTML = `[${new Date().toLocaleTimeString()}] 正在初始化 Git 备份流程...`;
    sendMessage('git_backup', { msg });
}

export function handleGitLog(data) {
    const term = document.getElementById('git-terminal');
    term.innerHTML += `\n[${new Date().toLocaleTimeString()}] ${data}`;
    term.scrollTop = term.scrollHeight;
}

// 导出到全局
window.startBackup = startBackup;