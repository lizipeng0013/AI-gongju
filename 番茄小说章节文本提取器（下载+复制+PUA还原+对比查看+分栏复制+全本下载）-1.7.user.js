// ==UserScript==
// @name         番茄小说章节文本提取器（下载+复制+PUA还原+对比查看+分栏复制+全本下载）
// @namespace    https://github.com/lizipeng0013/AI-gongju
// @version      1.7
// @description  提取番茄小说阅读页所有<p>文本，自动还原PUA混淆字符，支持单章/全本下载、复制、对比查看；全本按卷+章节组织结构；全本下载前自动定位到第一章；操作按钮可折叠
// @author       User
// @match        *://*.fanqienovel.com/reader/*
// @match        *://fanqienovel.com/reader/*
// @match        *://*.dnovel.com/reader/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ---------- PUA字符映射表（U+E3E8 等 -> 标准字符）----------
    const puaMapping = {
        "\uE3E8": "D", "\uE3E9": "在", "\uE3EA": "主", "\uE3EB": "特", "\uE3EC": "家",
        "\uE3ED": "军", "\uE3EE": "然", "\uE3EF": "表", "\uE3F0": "场", "\uE3F1": "4",
        "\uE3F2": "要", "\uE3F3": "只", "\uE3F4": "v", "\uE3F5": "和", "\uE3F7": "6",
        "\uE3F8": "别", "\uE3F9": "还", "\uE3FA": "g", "\uE3FB": "现", "\uE3FC": "几",
        "\uE3FD": "岁", "\uE400": "此", "\uE401": "象", "\uE402": "月", "\uE403": "3",
        "\uE404": "出", "\uE405": "战", "\uE406": "工", "\uE407": "相", "\uE408": "o",
        "\uE409": "男", "\uE40A": "直", "\uE40B": "失", "\uE40C": "世", "\uE40D": "F",
        "\uE40E": "都", "\uE40F": "平", "\uE410": "文", "\uE411": "什", "\uE412": "V",
        "\uE413": "O", "\uE414": "将", "\uE415": "真", "\uE416": "T", "\uE417": "那",
        "\uE418": "当", "\uE41A": "会", "\uE41B": "立", "\uE41C": "些", "\uE41D": "u",
        "\uE41E": "是", "\uE41F": "十", "\uE420": "张", "\uE421": "学", "\uE422": "气",
        "\uE423": "大", "\uE424": "爱", "\uE425": "两", "\uE426": "命", "\uE427": "全",
        "\uE428": "后", "\uE429": "东", "\uE42A": "性", "\uE42B": "通", "\uE42C": "被",
        "\uE42D": "1", "\uE42E": "它", "\uE42F": "乐", "\uE430": "接", "\uE431": "而",
        "\uE432": "感", "\uE433": "车", "\uE434": "山", "\uE435": "公", "\uE436": "了",
        "\uE437": "常", "\uE438": "以", "\uE439": "何", "\uE43A": "可", "\uE43B": "话",
        "\uE43C": "先", "\uE43D": "p", "\uE43E": "i", "\uE43F": "叫", "\uE440": "轻",
        "\uE441": "M", "\uE442": "士", "\uE443": "w", "\uE444": "着", "\uE445": "变",
        "\uE446": "尔", "\uE447": "快", "\uE448": "l", "\uE449": "个", "\uE44A": "说",
        "\uE44B": "少", "\uE44C": "色", "\uE44D": "里", "\uE44E": "安", "\uE44F": "花",
        "\uE450": "远", "\uE451": "7", "\uE452": "难", "\uE453": "师", "\uE454": "放",
        "\uE455": "t", "\uE456": "报", "\uE457": "认", "\uE458": "面", "\uE459": "道",
        "\uE45A": "S", "\uE45C": "克", "\uE45D": "地", "\uE45E": "度", "\uE45F": "I",
        "\uE460": "好", "\uE461": "机", "\uE462": "U", "\uE463": "民", "\uE464": "写",
        "\uE465": "把", "\uE466": "万", "\uE467": "同", "\uE468": "水", "\uE469": "新",
        "\uE46A": "没", "\uE46B": "书", "\uE46C": "电", "\uE46D": "吃", "\uE46E": "像",
        "\uE46F": "斯", "\uE470": "5", "\uE471": "为", "\uE472": "y", "\uE473": "白",
        "\uE474": "几", "\uE475": "日", "\uE476": "教", "\uE477": "看", "\uE478": "但",
        "\uE479": "第", "\uE47A": "加", "\uE47B": "候", "\uE47C": "作", "\uE47D": "上",
        "\uE47E": "拉", "\uE47F": "住", "\uE480": "有", "\uE481": "法", "\uE482": "r",
        "\uE483": "事", "\uE484": "应", "\uE485": "位", "\uE486": "利", "\uE487": "你",
        "\uE488": "声", "\uE489": "身", "\uE48A": "国", "\uE48B": "问", "\uE48C": "马",
        "\uE48D": "女", "\uE48E": "他", "\uE48F": "Y", "\uE490": "比", "\uE491": "父",
        "\uE492": "x", "\uE493": "A", "\uE494": "H", "\uE495": "N", "\uE496": "s",
        "\uE497": "X", "\uE498": "边", "\uE499": "美", "\uE49A": "对", "\uE49B": "所",
        "\uE49C": "金", "\uE49D": "活", "\uE49E": "回", "\uE49F": "意", "\uE4A0": "到",
        "\uE4A1": "z", "\uE4A2": "从", "\uE4A3": "j", "\uE4A4": "知", "\uE4A5": "又",
        "\uE4A6": "内", "\uE4A7": "因", "\uE4A8": "点", "\uE4A9": "Q", "\uE4AA": "三",
        "\uE4AB": "定", "\uE4AC": "8", "\uE4AD": "R", "\uE4AE": "b", "\uE4AF": "正",
        "\uE4B0": "或", "\uE4B1": "夫", "\uE4B2": "向", "\uE4B3": "德", "\uE4B4": "听",
        "\uE4B5": "更", "\uE4B7": "得", "\uE4B8": "告", "\uE4B9": "并", "\uE4BA": "本",
        "\uE4BB": "q", "\uE4BC": "过", "\uE4BD": "记", "\uE4BE": "L", "\uE4BF": "让",
        "\uE4C0": "打", "\uE4C1": "f", "\uE4C2": "人", "\uE4C3": "就", "\uE4C4": "者",
        "\uE4C5": "去", "\uE4C6": "原", "\uE4C7": "满", "\uE4C8": "体", "\uE4C9": "做",
        "\uE4CA": "经", "\uE4CB": "K", "\uE4CC": "走", "\uE4CD": "如", "\uE4CE": "孩",
        "\uE4CF": "c", "\uE4D0": "G", "\uE4D1": "给", "\uE4D2": "使", "\uE4D3": "物",
        "\uE4D5": "最", "\uE4D6": "笑", "\uE4D7": "部", "\uE4D9": "员", "\uE4DA": "等",
        "\uE4DB": "受", "\uE4DC": "k", "\uE4DD": "行", "\uE4DE": "一", "\uE4DF": "条",
        "\uE4E0": "果", "\uE4E1": "动", "\uE4E2": "光", "\uE4E3": "门", "\uE4E4": "头",
        "\uE4E5": "见", "\uE4E6": "往", "\uE4E7": "自", "\uE4E8": "解", "\uE4E9": "成",
        "\uE4EA": "处", "\uE4EB": "天", "\uE4EC": "能", "\uE4ED": "于", "\uE4EE": "名",
        "\uE4EF": "其", "\uE4F0": "发", "\uE4F1": "总", "\uE4F2": "母", "\uE4F3": "的",
        "\uE4F4": "死", "\uE4F5": "手", "\uE4F6": "入", "\uE4F7": "路", "\uE4F8": "进",
        "\uE4F9": "心", "\uE4FA": "来", "\uE4FB": "h", "\uE4FC": "时", "\uE4FD": "力",
        "\uE4FE": "多", "\uE4FF": "开", "\uE500": "已", "\uE501": "许", "\uE502": "d",
        "\uE503": "至", "\uE504": "由", "\uE505": "很", "\uE506": "界", "\uE507": "n",
        "\uE508": "小", "\uE509": "与", "\uE50A": "Z", "\uE50B": "想", "\uE50C": "代",
        "\uE50D": "么", "\uE50E": "分", "\uE50F": "生", "\uE510": "口", "\uE511": "再",
        "\uE512": "妈", "\uE513": "望", "\uE514": "次", "\uE515": "西", "\uE516": "风",
        "\uE517": "种", "\uE518": "带", "\uE519": "J", "\uE51B": "实", "\uE51C": "情",
        "\uE51D": "才", "\uE51E": "这", "\uE520": "E", "\uE521": "我", "\uE522": "神",
        "\uE523": "格", "\uE524": "长", "\uE525": "觉", "\uE526": "间", "\uE527": "年",
        "\uE528": "眼", "\uE529": "无", "\uE52A": "不", "\uE52B": "亲", "\uE52C": "关",
        "\uE52D": "结", "\uE52E": "0", "\uE52F": "友", "\uE530": "信", "\uE531": "下",
        "\uE532": "却", "\uE533": "重", "\uE534": "己", "\uE535": "老", "\uE536": "2",
        "\uE537": "音", "\uE538": "字", "\uE539": "m", "\uE53A": "呢", "\uE53B": "明",
        "\uE53C": "之", "\uE53D": "前", "\uE53E": "高", "\uE53F": "P", "\uE540": "B",
        "\uE541": "目", "\uE542": "太", "\uE543": "e", "\uE544": "9", "\uE545": "起",
        "\uE546": "稜", "\uE547": "她", "\uE548": "也", "\uE549": "W", "\uE54A": "用",
        "\uE54B": "方", "\uE54C": "子", "\uE54D": "英", "\uE54E": "每", "\uE54F": "理",
        "\uE550": "便", "\uE551": "四", "\uE552": "数", "\uE553": "期", "\uE554": "中",
        "\uE555": "C", "\uE556": "外", "\uE557": "样", "\uE558": "a", "\uE559": "海",
        "\uE55A": "们", "\uE55B": "任"
    };

    const puaChars = Object.keys(puaMapping);
    const puaRegex = new RegExp(puaChars.join('|'), 'g');

    function convertPUA(text) {
        if (!text) return text;
        return text.replace(puaRegex, (match) => puaMapping[match] || match);
    }

    // ============================================================
    // 基础工具：从 URL 提取 bookId 和 itemId
    // ============================================================
    function getBookIdFromUrl() {
        const params = new URLSearchParams(location.search);
        const fromQuery = params.get('bookId') || params.get('book_id');
        if (fromQuery) return fromQuery;

        try {
            const scripts = document.querySelectorAll('script');
            for (const s of scripts) {
                const m = s.textContent.match(/"bookId"\s*:\s*"?(\d{15,25})"?/);
                if (m) return m[1];
            }
        } catch (e) { /* ignore */ }
        return null;
    }

    function getCurrentItemId() {
        const m = location.pathname.match(/\/reader\/(\d+)/);
        return m ? m[1] : null;
    }

    // ============================================================
    // 获取含卷名的完整目录
    // ============================================================
    async function fetchFullDirectory(bookId) {
        const url = `https://fanqienovel.com/api/reader/directory/detail?bookId=${bookId}`;
        const resp = await fetch(url, { credentials: 'include' });
        if (!resp.ok) throw new Error(`目录接口请求失败：HTTP ${resp.status}`);
        const json = await resp.json();
        if (json.code !== 0 || !json.data) throw new Error('目录接口返回异常：' + JSON.stringify(json).slice(0, 200));

        const d = json.data;
        const volumeNames = d.volumeNameList || [];
        const chapterGroups = d.chapterListWithVolume || [];

        const chapters = [];
        for (let vi = 0; vi < chapterGroups.length; vi++) {
            const volumeTitle = volumeNames[vi] || '';
            const group = chapterGroups[vi] || [];
            for (const ch of group) {
                chapters.push({
                    itemId: String(ch.itemId || ch.item_id),
                    title: ch.title || '',
                    volumeTitle: volumeTitle
                });
            }
        }
        return { volumeNames, chapters };
    }

    // ============================================================
    // 从当前阅读页提取段落
    // ============================================================
    function getParagraphsData() {
        const contentDiv = document.querySelector('.muye-reader-content.noselect');
        if (!contentDiv) {
            return { success: false, errorMsg: '未找到正文区域，请确保在阅读页且内容已加载。' };
        }
        const paragraphs = contentDiv.querySelectorAll('p');
        if (!paragraphs || paragraphs.length === 0) {
            return { success: false, errorMsg: '未找到<p>段落，内容可能尚未加载。' };
        }
        const rawList = [];
        const cleanList = [];
        for (const p of paragraphs) {
            const raw = p.textContent;
            if (raw.trim() !== '') {
                rawList.push(raw);
                cleanList.push(convertPUA(raw));
            }
        }
        if (rawList.length === 0) {
            return { success: false, errorMsg: '提取到的内容为空。' };
        }
        return { success: true, rawList, cleanList, totalCount: rawList.length };
    }

    // ============================================================
    // 等待正文加载完成
    // ============================================================
    function waitForContent(timeoutMs = 15000, intervalMs = 300) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                const ps = document.querySelectorAll('.muye-reader-content.noselect p');
                let hasText = false;
                for (const p of ps) {
                    if (p.textContent.trim() !== '') { hasText = true; break; }
                }
                if (hasText) {
                    clearInterval(timer);
                    resolve();
                } else if (Date.now() - start > timeoutMs) {
                    clearInterval(timer);
                    reject(new Error('等待正文加载超时'));
                }
            }, intervalMs);
        });
    }

    // ============================================================
    // 点击“下一章”按钮
    // ============================================================
    function clickNextChapterButton() {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
            if (btn.textContent.trim() === '下一章' || btn.textContent.includes('下一章')) {
                btn.click();
                return true;
            }
        }
        const next = document.querySelector('.chapter-btn.next button, .chapter-btn.next');
        if (next) {
            (next.tagName === 'BUTTON' ? next : next.querySelector('button') || next).click();
            return true;
        }
        return false;
    }

    // ============================================================
    // 全本下载主流程
    // ============================================================
    let fullBookRunning = false;
    const AUTO_RESUME_KEY = 'fq_full_book_auto';

    async function runFullBookExtract(isAutoResume = false) {
        if (fullBookRunning) {
            alert('全本下载正在进行中，请稍候…');
            return;
        }

        const bookId = getBookIdFromUrl();
        if (!bookId) {
            alert('❌ 无法获取 bookId，请确认当前在阅读页。');
            return;
        }

        const currentItemId = getCurrentItemId();
        if (!currentItemId) {
            alert('❌ 无法获取当前章节 itemId。');
            return;
        }

        let directory;
        try {
            directory = await fetchFullDirectory(bookId);
        } catch (e) {
            alert('❌ 获取目录失败：' + e.message);
            return;
        }

        const { chapters } = directory;
        if (!chapters.length) {
            alert('❌ 目录为空，无法全本下载。');
            return;
        }

        // 全本下载前检查是否在第一章
        const firstChapter = chapters[0];
        if (currentItemId !== firstChapter.itemId) {
            if (isAutoResume) {
                alert('⚠️ 自动跳转到第一章失败，请手动切换到第一章后重新点击全本下载按钮。');
                return;
            }

            const curIndex = chapters.findIndex(c => c.itemId === currentItemId);
            const posInfo = curIndex >= 0
                ? `当前为第 ${curIndex + 1} 章 / 共 ${chapters.length} 章`
                : `当前章节不在目录中（共 ${chapters.length} 章）`;

            const ok = confirm(
                `📖 ${posInfo}\n\n` +
                `检测到当前不在第一章。为保证全本内容完整，将先跳转到第一章，` +
                `然后自动开始全本下载。\n\n是否继续？`
            );
            if (!ok) return;

            try {
                sessionStorage.setItem(AUTO_RESUME_KEY, JSON.stringify({
                    bookId,
                    ts: Date.now()
                }));
            } catch (e) { /* ignore */ }

            location.href = `${location.origin}/reader/${firstChapter.itemId}?bookId=${bookId}`;
            return;
        }

        const fromIndex = 0;

        fullBookRunning = true;
        // 展开面板以便看到进度
        setPanelOpen(true);

        const btnDownload = document.getElementById('fq-full-download-btn');
        const setBtnsDisabled = (disabled) => {
            if (btnDownload) btnDownload.disabled = disabled;
        };
        setBtnsDisabled(true);

        const parts = [];
        let currentVolume = null;
        let completed = 0;
        const total = chapters.length - fromIndex;

        try {
            for (let i = fromIndex; i < chapters.length; i++) {
                const ch = chapters[i];

                if (ch.volumeTitle && ch.volumeTitle !== currentVolume) {
                    currentVolume = ch.volumeTitle;
                    parts.push(`\n\n${currentVolume}\n\n`);
                }

                if (getCurrentItemId() !== ch.itemId) {
                    const navigatedByButton = clickNextChapterButton();
                    if (!navigatedByButton) {
                        location.href = `${location.origin}/reader/${ch.itemId}?bookId=${bookId}`;
                        alert('当前页无法通过“下一章”按钮翻页，已尝试跳转。请在新页面重新点击“全本下载”。');
                        return;
                    }
                    await waitForContent(15000, 300);
                    await new Promise(r => setTimeout(r, 500));
                }

                const data = getParagraphsData();
                if (!data.success) {
                    parts.push(`\n\n【${ch.title || '未知章节'}】提取失败：${data.errorMsg}\n\n`);
                } else {
                    parts.push(`\n\n${ch.title || '（无章节名）'}\n\n`);
                    parts.push(data.cleanList.join('\n\n'));
                }

                completed++;
                if (btnDownload) btnDownload.textContent = `⏳ 全本下载中… ${completed}/${total}`;

                await new Promise(r => setTimeout(r, 800));
            }

            const fullText = parts.join('').trim();
            const fileName = generateFullBookFileName();
            downloadTxtFile(fullText, fileName);
            alert(`✅ 全本下载完成！\n共 ${completed} 章\n文件名：${fileName}`);
        } catch (e) {
            alert('❌ 全本下载中断：' + e.message + '\n已完成部分可尝试重新运行或手动下载。');
        } finally {
            fullBookRunning = false;
            setBtnsDisabled(false);
            if (btnDownload) btnDownload.textContent = '📥 全本下载';
        }
    }

    // ============================================================
    // 跳转到第一章后自动恢复全本流程
    // ============================================================
    function showAutoResumeTip() {
        const tip = document.createElement('div');
        tip.id = 'fq-auto-resume-tip';
        tip.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: #323232; color: #fff; padding: 12px 24px; border-radius: 40px;
            z-index: 10001; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
            font-size: 14px; box-shadow: 0 6px 20px rgba(0,0,0,0.3); letter-spacing: 0.5px;
        `;
        tip.textContent = '⏳ 已跳转到第一章，正在自动开始全本下载…';
        document.body.appendChild(tip);
        setTimeout(() => tip.remove(), 6000);
    }

    function tryAutoResumeFullBook() {
        let raw = null;
        try { raw = sessionStorage.getItem(AUTO_RESUME_KEY); } catch (e) { return; }
        if (!raw) return;

        try { sessionStorage.removeItem(AUTO_RESUME_KEY); } catch (e) { /* ignore */ }

        let info = null;
        try { info = JSON.parse(raw); } catch (e) { return; }
        if (!info) return;

        if (Date.now() - (info.ts || 0) > 60000) return;

        showAutoResumeTip();

        waitForContent(20000, 300)
            .then(() => {
                setTimeout(() => runFullBookExtract(true), 800);
            })
            .catch(() => {
                alert('⚠️ 无法自动开始全本下载：正文加载超时，请手动点击全本下载按钮。');
            });
    }

    // ============================================================
    // 全本书名（用于文件名）
    // ============================================================
    function generateFullBookFileName() {
        let base = '番茄小说全本';
        const titleEl = document.querySelector('.muye-reader-title, h1[class*="title"]');
        if (titleEl && titleEl.textContent.trim()) {
            base = convertPUA(titleEl.textContent.trim()).slice(0, 80);
        }
        base = base.replace(/[\\/:*?"<>|\r\n]/g, '_');
        return `${base}_全本.txt`;
    }

    // ============================================================
    // 单章功能：下载、复制
    // ============================================================
    function getCurrentChapterTitle() {
        const el = document.querySelector('h1.muye-reader-title');
        if (el && el.textContent.trim()) return convertPUA(el.textContent.trim());
        const fallback = document.querySelector('.reader-chapter-title, .chapter-title');
        return fallback ? convertPUA(fallback.textContent.trim()) : '';
    }

    function extractCurrentChapterText() {
        const data = getParagraphsData();
        if (!data.success) return { success: false, errorMsg: data.errorMsg };
        const title = getCurrentChapterTitle();
        const body = data.cleanList.join('\n\n');
        const text = title ? `${title}\n\n${body}` : body;
        return { success: true, text, paragraphCount: data.totalCount, chapterTitle: title };
    }

    function extractAndDownload() {
        const result = extractCurrentChapterText();
        if (!result.success) {
            alert(`❌ 提取失败\n\n${result.errorMsg}`);
            return;
        }
        const fileName = generateChapterFileName(result.chapterTitle);
        downloadTxtFile(result.text, fileName);
        alert(`✅ 下载完成！\n共 ${result.paragraphCount} 个段落\n文件名：${fileName}`);
    }

    async function extractAndCopy() {
        const result = extractCurrentChapterText();
        if (!result.success) {
            alert(`❌ 提取失败\n\n${result.errorMsg}`);
            return;
        }
        try {
            await navigator.clipboard.writeText(result.text);
            alert(`✅ 复制成功！\n已复制 ${result.paragraphCount} 个段落（含章节名）。`);
        } catch (err) {
            alert(`❌ 复制失败：${err.message}`);
        }
    }

    function generateChapterFileName(chapterTitle) {
        let base = '番茄小说章节';
        if (chapterTitle) {
            base = chapterTitle.slice(0, 80);
        }
        base = base.replace(/[\\/:*?"<>|\r\n]/g, '_');
        return `${base}.txt`;
    }

    function downloadTxtFile(content, filename) {
        const blob = new Blob(['\uFEFF' + content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // ============================================================
    // 对比查看
    // ============================================================
    function showCompareDialog() {
        const data = getParagraphsData();
        if (!data.success) {
            alert(`❌ 无法获取对比内容\n\n${data.errorMsg}`);
            return;
        }
        const existing = document.getElementById('fanqie-compare-panel');
        if (existing) existing.remove();

        const panel = document.createElement('div');
        panel.id = 'fanqie-compare-panel';
        panel.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 90vw; height: 85vh; max-width: 1400px; background: white;
            border-radius: 20px; box-shadow: 0 20px 35px rgba(0,0,0,0.3);
            z-index: 10000; display: flex; flex-direction: column;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
            overflow: hidden; border: 1px solid #e0e0e0;
        `;

        const header = document.createElement('div');
        header.style.cssText = `padding: 16px 24px; background: #f5f5f5; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;`;
        const title = document.createElement('h3');
        title.textContent = `🔍 PUA还原对比（共 ${data.totalCount} 段）`;
        title.style.margin = '0';
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✖ 关闭';
        closeBtn.style.cssText = `background: #f44336; color: white; border: none; border-radius: 40px; padding: 6px 16px; font-weight: bold; cursor: pointer;`;
        closeBtn.onclick = () => panel.remove();
        header.appendChild(title);
        header.appendChild(closeBtn);

        const wrapper = document.createElement('div');
        wrapper.style.cssText = `display: flex; flex: 1; overflow: hidden;`;

        const makeCol = (heading, list, bg, copyLabel) => {
            const col = document.createElement('div');
            col.style.cssText = `flex: 1; display: flex; flex-direction: column; background: ${bg}; overflow: hidden;`;
            const ch = document.createElement('div');
            ch.style.cssText = `padding: 10px 16px; background: rgba(0,0,0,0.05); border-bottom: 1px solid #ccc; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;`;
            ch.innerHTML = `<span style="font-weight:bold;">${heading}</span>`;
            const copyBtn = document.createElement('button');
            copyBtn.textContent = '📋 复制本栏';
            copyBtn.style.cssText = `background: #5c6bc0; color: white; border: none; border-radius: 30px; padding: 6px 14px; font-size: 12px; cursor: pointer;`;
            copyBtn.onclick = async () => {
                try {
                    await navigator.clipboard.writeText(list.join('\n\n'));
                    alert(`✅ 已复制「${copyLabel}」${list.length} 个段落。`);
                } catch (e) { alert('复制失败：' + e.message); }
            };
            ch.appendChild(copyBtn);
            col.appendChild(ch);

            const area = document.createElement('div');
            area.style.cssText = `flex: 1; overflow-y: auto; padding: 16px; line-height: 1.6; font-size: 15px;`;
            list.forEach((p, i) => {
                const d = document.createElement('div');
                d.style.cssText = `margin-bottom: 20px; border-left: 3px solid #ff9800; padding-left: 12px; background: rgba(255,255,255,0.6); border-radius: 0 8px 8px 0;`;
                d.innerHTML = `<div style="font-size:12px;color:#888;margin-bottom:6px;font-family:monospace;">第 ${i + 1} 段</div><div style="white-space:pre-wrap;word-break:break-word;">${p.replace(/</g, '&lt;')}</div>`;
                area.appendChild(d);
            });
            col.appendChild(area);
            return col;
        };

        wrapper.appendChild(makeCol('📄 原始（含PUA）', data.rawList, '#fff9e6', '原始文本'));
        wrapper.appendChild(makeCol('✨ 还原后（标准字符）', data.cleanList, '#e8f5e9', '还原文本'));

        panel.appendChild(header);
        panel.appendChild(wrapper);
        document.body.appendChild(panel);

        const esc = (e) => { if (e.key === 'Escape') { panel.remove(); document.removeEventListener('keydown', esc); } };
        document.addEventListener('keydown', esc);
        const origRemove = panel.remove.bind(panel);
        panel.remove = () => { document.removeEventListener('keydown', esc); origRemove(); };
    }

    // ============================================================
    // UI：可折叠按钮面板
    // ============================================================
    const CONTAINER_ID = 'fanqie-txt-extractor-buttons';
    const PANEL_ID = 'fq-action-panel';
    const TOGGLE_ID = 'fq-toggle-btn';

    function setPanelOpen(open) {
        const panel = document.getElementById(PANEL_ID);
        const toggle = document.getElementById(TOGGLE_ID);
        if (panel) panel.style.display = open ? 'flex' : 'none';
        if (toggle) {
            toggle.textContent = open ? '✖' : '📖';
            toggle.title = open ? '收起操作菜单' : '展开操作菜单';
        }
    }

    function createButton(text, bg, hover, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            background-color: ${bg}; color: white; border: none; border-radius: 40px;
            padding: 12px 24px; font-size: 16px; font-weight: bold; cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: all 0.2s ease;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
            letter-spacing: 0.5px; width: 220px; text-align: center;
        `;
        btn.addEventListener('mouseenter', () => { btn.style.backgroundColor = hover; btn.style.transform = 'scale(1.02)'; });
        btn.addEventListener('mouseleave', () => { btn.style.backgroundColor = bg; btn.style.transform = 'scale(1)'; });
        btn.addEventListener('click', onClick);
        return btn;
    }

    function addButtons() {
        const old = document.getElementById(CONTAINER_ID);
        if (old) old.remove();
        const oldPanel = document.getElementById('fanqie-compare-panel');
        if (oldPanel) oldPanel.remove();

        const container = document.createElement('div');
        container.id = CONTAINER_ID;
        container.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 9999;
            display: flex; flex-direction: column; align-items: flex-end; gap: 10px;
        `;

        // 折叠面板（默认隐藏）
        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.style.cssText = `
            display: none; flex-direction: column; gap: 10px; align-items: flex-end;
        `;

        // 单章功能
        panel.appendChild(createButton('📥 下载本章（含章节名）', '#4CAF50', '#45a049', extractAndDownload));
        panel.appendChild(createButton('📋 复制本章（含章节名）', '#2196F3', '#0b7dda', extractAndCopy));
        panel.appendChild(createButton('🔍 对比查看（PUA还原前后）', '#ff9800', '#fb8c00', showCompareDialog));

        // 全本下载（已移除全本复制）
        const fullDl = createButton('📥 全本下载', '#9C27B0', '#7B1FA2', () => runFullBookExtract(false));
        fullDl.id = 'fq-full-download-btn';
        panel.appendChild(fullDl);

        // 折叠开关按钮（小圆钮）
        const toggle = document.createElement('button');
        toggle.id = TOGGLE_ID;
        toggle.textContent = '📖';
        toggle.title = '展开操作菜单';
        toggle.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; border: none; border-radius: 50%;
            width: 52px; height: 52px; font-size: 22px; cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
            display: flex; align-items: center; justify-content: center;
            padding: 0; line-height: 1;
        `;
        toggle.addEventListener('mouseenter', () => { toggle.style.transform = 'scale(1.08)'; });
        toggle.addEventListener('mouseleave', () => { toggle.style.transform = 'scale(1)'; });
        toggle.addEventListener('click', () => {
            const isOpen = panel.style.display === 'flex';
            setPanelOpen(!isOpen);
        });

        container.appendChild(panel);
        container.appendChild(toggle);
        document.body.appendChild(container);
    }

    function init() {
        const setup = () => {
            addButtons();
            tryAutoResumeFullBook();
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setup);
        } else {
            setup();
        }
    }

    init();
})();