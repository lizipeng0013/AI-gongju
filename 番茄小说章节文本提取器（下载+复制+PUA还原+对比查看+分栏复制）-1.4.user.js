// ==UserScript==
// @name         番茄小说章节文本提取器（下载+复制+PUA还原+对比查看+分栏复制）
// @namespace    https://github.com/lizipeng0013/AI-gongju
// @version      1.4
// @description  提取番茄小说阅读页所有<p>文本，自动还原番茄小说PUA混淆字符，支持下载TXT、复制全文、并排对比还原前后文本，且左右栏可分别复制全部内容
// @author       User
// @match        *://*.fanqienovel.com/*
// @match        *://fanqienovel.com/*
// @match        *://*.dnovel.com/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ---------- PUA字符映射表（U+E3E8 等 -> 标准字符）----------
    const puaMapping = {
        "\uE3E8": "D",
        "\uE3E9": "在",
        "\uE3EA": "主",
        "\uE3EB": "特",
        "\uE3EC": "家",
        "\uE3ED": "军",
        "\uE3EE": "然",
        "\uE3EF": "表",
        "\uE3F0": "场",
        "\uE3F1": "4",
        "\uE3F2": "要",
        "\uE3F3": "只",
        "\uE3F4": "v",
        "\uE3F5": "和",
        "\uE3F7": "6",
        "\uE3F8": "别",
        "\uE3F9": "还",
        "\uE3FA": "g",
        "\uE3FB": "现",
        "\uE3FC": "几",
        "\uE3FD": "岁",
        "\uE400": "此",
        "\uE401": "象",
        "\uE402": "月",
        "\uE403": "3",
        "\uE404": "出",
        "\uE405": "战",
        "\uE406": "工",
        "\uE407": "相",
        "\uE408": "o",
        "\uE409": "男",
        "\uE40A": "直",
        "\uE40B": "失",
        "\uE40C": "世",
        "\uE40D": "F",
        "\uE40E": "都",
        "\uE40F": "平",
        "\uE410": "文",
        "\uE411": "什",
        "\uE412": "V",
        "\uE413": "O",
        "\uE414": "将",
        "\uE415": "真",
        "\uE416": "T",
        "\uE417": "那",
        "\uE418": "当",
        "\uE41A": "会",
        "\uE41B": "立",
        "\uE41C": "些",
        "\uE41D": "u",
        "\uE41E": "是",
        "\uE41F": "十",
        "\uE420": "张",
        "\uE421": "学",
        "\uE422": "气",
        "\uE423": "大",
        "\uE424": "爱",
        "\uE425": "两",
        "\uE426": "命",
        "\uE427": "全",
        "\uE428": "后",
        "\uE429": "东",
        "\uE42A": "性",
        "\uE42B": "通",
        "\uE42C": "被",
        "\uE42D": "1",
        "\uE42E": "它",
        "\uE42F": "乐",
        "\uE430": "接",
        "\uE431": "而",
        "\uE432": "感",
        "\uE433": "车",
        "\uE434": "山",
        "\uE435": "公",
        "\uE436": "了",
        "\uE437": "常",
        "\uE438": "以",
        "\uE439": "何",
        "\uE43A": "可",
        "\uE43B": "话",
        "\uE43C": "先",
        "\uE43D": "p",
        "\uE43E": "i",
        "\uE43F": "叫",
        "\uE440": "轻",
        "\uE441": "M",
        "\uE442": "士",
        "\uE443": "w",
        "\uE444": "着",
        "\uE445": "变",
        "\uE446": "尔",
        "\uE447": "快",
        "\uE448": "l",
        "\uE449": "个",
        "\uE44A": "说",
        "\uE44B": "少",
        "\uE44C": "色",
        "\uE44D": "里",
        "\uE44E": "安",
        "\uE44F": "花",
        "\uE450": "远",
        "\uE451": "7",
        "\uE452": "难",
        "\uE453": "师",
        "\uE454": "放",
        "\uE455": "t",
        "\uE456": "报",
        "\uE457": "认",
        "\uE458": "面",
        "\uE459": "道",
        "\uE45A": "S",
        "\uE45C": "克",
        "\uE45D": "地",
        "\uE45E": "度",
        "\uE45F": "I",
        "\uE460": "好",
        "\uE461": "机",
        "\uE462": "U",
        "\uE463": "民",
        "\uE464": "写",
        "\uE465": "把",
        "\uE466": "万",
        "\uE467": "同",
        "\uE468": "水",
        "\uE469": "新",
        "\uE46A": "没",
        "\uE46B": "书",
        "\uE46C": "电",
        "\uE46D": "吃",
        "\uE46E": "像",
        "\uE46F": "斯",
        "\uE470": "5",
        "\uE471": "为",
        "\uE472": "y",
        "\uE473": "白",
        "\uE474": "几",
        "\uE475": "日",
        "\uE476": "教",
        "\uE477": "看",
        "\uE478": "但",
        "\uE479": "第",
        "\uE47A": "加",
        "\uE47B": "候",
        "\uE47C": "作",
        "\uE47D": "上",
        "\uE47E": "拉",
        "\uE47F": "住",
        "\uE480": "有",
        "\uE481": "法",
        "\uE482": "r",
        "\uE483": "事",
        "\uE484": "应",
        "\uE485": "位",
        "\uE486": "利",
        "\uE487": "你",
        "\uE488": "声",
        "\uE489": "身",
        "\uE48A": "国",
        "\uE48B": "问",
        "\uE48C": "马",
        "\uE48D": "女",
        "\uE48E": "他",
        "\uE48F": "Y",
        "\uE490": "比",
        "\uE491": "父",
        "\uE492": "x",
        "\uE493": "A",
        "\uE494": "H",
        "\uE495": "N",
        "\uE496": "s",
        "\uE497": "X",
        "\uE498": "边",
        "\uE499": "美",
        "\uE49A": "对",
        "\uE49B": "所",
        "\uE49C": "金",
        "\uE49D": "活",
        "\uE49E": "回",
        "\uE49F": "意",
        "\uE4A0": "到",
        "\uE4A1": "z",
        "\uE4A2": "从",
        "\uE4A3": "j",
        "\uE4A4": "知",
        "\uE4A5": "又",
        "\uE4A6": "内",
        "\uE4A7": "因",
        "\uE4A8": "点",
        "\uE4A9": "Q",
        "\uE4AA": "三",
        "\uE4AB": "定",
        "\uE4AC": "8",
        "\uE4AD": "R",
        "\uE4AE": "b",
        "\uE4AF": "正",
        "\uE4B0": "或",
        "\uE4B1": "夫",
        "\uE4B2": "向",
        "\uE4B3": "德",
        "\uE4B4": "听",
        "\uE4B5": "更",
        "\uE4B7": "得",
        "\uE4B8": "告",
        "\uE4B9": "并",
        "\uE4BA": "本",
        "\uE4BB": "q",
        "\uE4BC": "过",
        "\uE4BD": "记",
        "\uE4BE": "L",
        "\uE4BF": "让",
        "\uE4C0": "打",
        "\uE4C1": "f",
        "\uE4C2": "人",
        "\uE4C3": "就",
        "\uE4C4": "者",
        "\uE4C5": "去",
        "\uE4C6": "原",
        "\uE4C7": "满",
        "\uE4C8": "体",
        "\uE4C9": "做",
        "\uE4CA": "经",
        "\uE4CB": "K",
        "\uE4CC": "走",
        "\uE4CD": "如",
        "\uE4CE": "孩",
        "\uE4CF": "c",
        "\uE4D0": "G",
        "\uE4D1": "给",
        "\uE4D2": "使",
        "\uE4D3": "物",
        "\uE4D5": "最",
        "\uE4D6": "笑",
        "\uE4D7": "部",
        "\uE4D9": "员",
        "\uE4DA": "等",
        "\uE4DB": "受",
        "\uE4DC": "k",
        "\uE4DD": "行",
        "\uE4DE": "一",
        "\uE4DF": "条",
        "\uE4E0": "果",
        "\uE4E1": "动",
        "\uE4E2": "光",
        "\uE4E3": "门",
        "\uE4E4": "头",
        "\uE4E5": "见",
        "\uE4E6": "往",
        "\uE4E7": "自",
        "\uE4E8": "解",
        "\uE4E9": "成",
        "\uE4EA": "处",
        "\uE4EB": "天",
        "\uE4EC": "能",
        "\uE4ED": "于",
        "\uE4EE": "名",
        "\uE4EF": "其",
        "\uE4F0": "发",
        "\uE4F1": "总",
        "\uE4F2": "母",
        "\uE4F3": "的",
        "\uE4F4": "死",
        "\uE4F5": "手",
        "\uE4F6": "入",
        "\uE4F7": "路",
        "\uE4F8": "进",
        "\uE4F9": "心",
        "\uE4FA": "来",
        "\uE4FB": "h",
        "\uE4FC": "时",
        "\uE4FD": "力",
        "\uE4FE": "多",
        "\uE4FF": "开",
        "\uE500": "已",
        "\uE501": "许",
        "\uE502": "d",
        "\uE503": "至",
        "\uE504": "由",
        "\uE505": "很",
        "\uE506": "界",
        "\uE507": "n",
        "\uE508": "小",
        "\uE509": "与",
        "\uE50A": "Z",
        "\uE50B": "想",
        "\uE50C": "代",
        "\uE50D": "么",
        "\uE50E": "分",
        "\uE50F": "生",
        "\uE510": "口",
        "\uE511": "再",
        "\uE512": "妈",
        "\uE513": "望",
        "\uE514": "次",
        "\uE515": "西",
        "\uE516": "风",
        "\uE517": "种",
        "\uE518": "带",
        "\uE519": "J",
        "\uE51B": "实",
        "\uE51C": "情",
        "\uE51D": "才",
        "\uE51E": "这",
        "\uE520": "E",
        "\uE521": "我",
        "\uE522": "神",
        "\uE523": "格",
        "\uE524": "长",
        "\uE525": "觉",
        "\uE526": "间",
        "\uE527": "年",
        "\uE528": "眼",
        "\uE529": "无",
        "\uE52A": "不",
        "\uE52B": "亲",
        "\uE52C": "关",
        "\uE52D": "结",
        "\uE52E": "0",
        "\uE52F": "友",
        "\uE530": "信",
        "\uE531": "下",
        "\uE532": "却",
        "\uE533": "重",
        "\uE534": "己",
        "\uE535": "老",
        "\uE536": "2",
        "\uE537": "音",
        "\uE538": "字",
        "\uE539": "m",
        "\uE53A": "呢",
        "\uE53B": "明",
        "\uE53C": "之",
        "\uE53D": "前",
        "\uE53E": "高",
        "\uE53F": "P",
        "\uE540": "B",
        "\uE541": "目",
        "\uE542": "太",
        "\uE543": "e",
        "\uE544": "9",
        "\uE545": "起",
        "\uE546": "稜",
        "\uE547": "她",
        "\uE548": "也",
        "\uE549": "W",
        "\uE54A": "用",
        "\uE54B": "方",
        "\uE54C": "子",
        "\uE54D": "英",
        "\uE54E": "每",
        "\uE54F": "理",
        "\uE550": "便",
        "\uE551": "四",
        "\uE552": "数",
        "\uE553": "期",
        "\uE554": "中",
        "\uE555": "C",
        "\uE556": "外",
        "\uE557": "样",
        "\uE558": "a",
        "\uE559": "海",
        "\uE55A": "们",
        "\uE55B": "任"
    };

    // 构建用于全局替换的正则表达式（匹配任一PUA字符）
    const puaChars = Object.keys(puaMapping);
    const puaRegex = new RegExp(puaChars.join('|'), 'g');

    /**
     * 将字符串中的PUA字符还原为标准字符
     * @param {string} text 原始文本
     * @returns {string} 还原后的文本
     */
    function convertPUA(text) {
        if (!text) return text;
        return text.replace(puaRegex, (match) => puaMapping[match] || match);
    }

    /**
     * 获取正文容器的段落数据（原始文本数组和还原文本数组）
     * @returns {Object} { success, errorMsg, rawList, cleanList, totalCount }
     */
    function getParagraphsData() {
        const contentDiv = document.querySelector('.muye-reader-content.noselect');
        if (!contentDiv) {
            return { success: false, errorMsg: '未找到小说正文区域，请确保在番茄小说阅读页且内容已加载。' };
        }
        const paragraphs = contentDiv.querySelectorAll('p');
        if (!paragraphs || paragraphs.length === 0) {
            return { success: false, errorMsg: '未找到任何<p>段落，可能内容未加载完毕，请滚动页面后再试。' };
        }
        const rawList = [];
        const cleanList = [];
        for (let i = 0; i < paragraphs.length; i++) {
            const rawText = paragraphs[i].textContent;      // 保留原始字符（包含PUA）
            if (rawText.trim() !== '') {
                rawList.push(rawText);
                cleanList.push(convertPUA(rawText));
            }
        }
        if (rawList.length === 0) {
            return { success: false, errorMsg: '提取到的内容为空（段落内无可见文字）。' };
        }
        return {
            success: true,
            rawList: rawList,
            cleanList: cleanList,
            totalCount: rawList.length
        };
    }

    /**
     * 提取并拼接完整还原文本（用于下载/复制全文）
     * @returns {Object} { success, errorMsg, text, paragraphCount, totalCount }
     */
    function extractText() {
        const data = getParagraphsData();
        if (!data.success) {
            return { success: false, errorMsg: data.errorMsg };
        }
        const fullText = data.cleanList.join('\n\n');
        return {
            success: true,
            text: fullText,
            paragraphCount: data.totalCount,
            totalCount: data.totalCount
        };
    }

    // ---------- UI 元素管理 ----------
    const CONTAINER_ID = 'fanqie-txt-extractor-buttons';

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addButtons);
        } else {
            addButtons();
        }
    }

    function removeOldButtons() {
        const oldContainer = document.getElementById(CONTAINER_ID);
        if (oldContainer) oldContainer.remove();
        // 移除可能残留的对比面板
        const oldPanel = document.getElementById('fanqie-compare-panel');
        if (oldPanel) oldPanel.remove();
    }

    function addButtons() {
        removeOldButtons();

        const container = document.createElement('div');
        container.id = CONTAINER_ID;
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 12px;
        `;

        const downloadBtn = createButton('📥 下载本章文本', '#4CAF50', '#45a049', extractAndDownload);
        const copyBtn = createButton('📋 复制本章文本', '#2196F3', '#0b7dda', extractAndCopy);
        const compareBtn = createButton('🔍 对比查看（PUA还原前后）', '#ff9800', '#fb8c00', showCompareDialog);

        container.appendChild(downloadBtn);
        container.appendChild(copyBtn);
        container.appendChild(compareBtn);
        document.body.appendChild(container);
    }

    function createButton(text, bgColor, hoverColor, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            background-color: ${bgColor};
            color: white;
            border: none;
            border-radius: 40px;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            letter-spacing: 0.5px;
            width: 220px;
            text-align: center;
        `;
        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = hoverColor;
            btn.style.transform = 'scale(1.02)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = bgColor;
            btn.style.transform = 'scale(1)';
        });
        btn.addEventListener('click', onClick);
        return btn;
    }

    // ---------- 下载 / 复制全文 ----------
    function extractAndDownload() {
        const result = extractText();
        if (!result.success) {
            alert(`❌ 提取失败\n\n${result.errorMsg}`);
            return;
        }
        const fileName = generateFileName();
        downloadTxtFile(result.text, fileName);
        alert(`✅ 下载完成！（已自动还原番茄小说PUA字符）\n\n共提取 ${result.paragraphCount} 个段落\n文件名：${fileName}`);
    }

    async function extractAndCopy() {
        const result = extractText();
        if (!result.success) {
            alert(`❌ 提取失败\n\n${result.errorMsg}`);
            return;
        }
        try {
            await navigator.clipboard.writeText(result.text);
            alert(`✅ 复制成功！（已自动还原番茄小说PUA字符）\n\n已复制 ${result.paragraphCount} 个段落的文本到剪贴板。`);
        } catch (err) {
            alert(`❌ 复制失败\n\n可能原因：浏览器权限不足。可尝试手动复制。\n错误信息：${err.message}`);
        }
    }

    function generateFileName() {
        let baseName = '番茄小说章节';
        let title = document.title.trim();
        if (title) {
            let cleanTitle = title.replace(/[-|—]\s*番茄小说.*$/, '').replace(/番茄小说/, '').trim();
            if (cleanTitle) baseName = cleanTitle;
        }
        const selectors = [
            '.reader-chapter-title',
            '.chapter-title',
            '.common-chapter-title',
            '.title-text',
            '.chapterName',
            'h1[class*="title"]',
            'h2[class*="title"]'
        ];
        for (let sel of selectors) {
            const elem = document.querySelector(sel);
            if (elem && elem.innerText && elem.innerText.trim()) {
                let chapterText = elem.innerText.trim();
                chapterText = convertPUA(chapterText);
                if (chapterText.length > 60) chapterText = chapterText.slice(0, 60);
                baseName = `${baseName}_${chapterText}`;
                break;
            }
        }
        baseName = baseName.replace(/[\\/:*?"<>|\r\n]/g, '_');
        if (baseName.length > 100) baseName = baseName.slice(0, 100);
        return `${baseName}.txt`;
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

    // ---------- 对比查看（两栏文本，带分栏复制按钮，可关闭）----------
    async function copyColumnText(paragraphs, columnName) {
        const fullText = paragraphs.join('\n\n');
        try {
            await navigator.clipboard.writeText(fullText);
            alert(`✅ 已复制「${columnName}」全部内容（${paragraphs.length} 个段落）到剪贴板。`);
        } catch (err) {
            alert(`❌ 复制「${columnName}」失败：${err.message}`);
        }
    }

    function showCompareDialog() {
        // 获取段落数据
        const data = getParagraphsData();
        if (!data.success) {
            alert(`❌ 无法获取对比内容\n\n${data.errorMsg}`);
            return;
        }

        // 移除已存在的面板（避免重复）
        const existingPanel = document.getElementById('fanqie-compare-panel');
        if (existingPanel) existingPanel.remove();

        // 创建面板容器
        const panel = document.createElement('div');
        panel.id = 'fanqie-compare-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90vw;
            height: 85vh;
            max-width: 1400px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 35px rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            overflow: hidden;
            border: 1px solid #e0e0e0;
        `;

        // 标题栏和关闭按钮
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 16px 24px;
            background: #f5f5f5;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
        `;
        const title = document.createElement('h3');
        title.textContent = `🔍 PUA字符还原对比（共 ${data.totalCount} 个段落）`;
        title.style.margin = '0';
        title.style.fontSize = '18px';
        title.style.color = '#333';
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✖ 关闭';
        closeBtn.style.cssText = `
            background: #f44336;
            color: white;
            border: none;
            border-radius: 40px;
            padding: 6px 16px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: 0.2s;
        `;
        closeBtn.addEventListener('mouseenter', () => closeBtn.style.backgroundColor = '#d32f2f');
        closeBtn.addEventListener('mouseleave', () => closeBtn.style.backgroundColor = '#f44336');
        closeBtn.addEventListener('click', () => panel.remove());
        header.appendChild(title);
        header.appendChild(closeBtn);
        panel.appendChild(header);

        // 两栏主体
        const compareWrapper = document.createElement('div');
        compareWrapper.style.cssText = `
            display: flex;
            flex: 1;
            overflow: hidden;
            gap: 0;
        `;

        // 左栏（原始文本，含PUA） + 自定义复制函数
        const leftCol = createCompareColumn(
            '📄 原始文本（含PUA混淆字符）',
            data.rawList,
            '#fff9e6',
            () => copyColumnText(data.rawList, '原始文本（含PUA）')
        );
        // 右栏（还原后文本）
        const rightCol = createCompareColumn(
            '✨ 还原后文本（标准字符）',
            data.cleanList,
            '#e8f5e9',
            () => copyColumnText(data.cleanList, '还原后文本（标准字符）')
        );

        compareWrapper.appendChild(leftCol);
        compareWrapper.appendChild(rightCol);
        panel.appendChild(compareWrapper);

        // 底部提示
        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 10px 16px;
            background: #fafafa;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
            text-align: center;
            flex-shrink: 0;
        `;
        footer.textContent = '💡 提示：PUA字符在左侧可能显示为特殊符号或小方框，右侧为还原后的正常字符。点击每栏右上角的“📋 复制本栏”可单独复制该栏全部内容。';
        panel.appendChild(footer);

        document.body.appendChild(panel);

        // 简单ESC键关闭
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                panel.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        // 面板移除时解绑
        const originalRemove = panel.remove.bind(panel);
        panel.remove = () => {
            document.removeEventListener('keydown', escHandler);
            originalRemove();
        };
    }

    /**
     * 创建对比用的一列（带复制本栏按钮）
     * @param {string} titleText 列标题
     * @param {string[]} paragraphs 段落文本数组
     * @param {string} bgColor 背景色
     * @param {Function} onCopy 点击复制按钮时的回调
     * @returns {HTMLElement} 列容器
     */
    function createCompareColumn(titleText, paragraphs, bgColor, onCopy) {
        const column = document.createElement('div');
        column.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            background: ${bgColor};
            overflow: hidden;
            border-right: 1px solid #ddd;
        `;
        // 列标题区（包含标题文字和复制按钮）
        const colHeader = document.createElement('div');
        colHeader.style.cssText = `
            padding: 12px 16px;
            background: rgba(0,0,0,0.05);
            border-bottom: 1px solid #ccc;
            flex-shrink: 0;
            position: sticky;
            top: 0;
            backdrop-filter: blur(4px);
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        const titleSpan = document.createElement('span');
        titleSpan.textContent = titleText;
        titleSpan.style.fontWeight = 'bold';
        titleSpan.style.fontSize = '16px';
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '📋 复制本栏';
        copyBtn.style.cssText = `
            background: #5c6bc0;
            border: none;
            color: white;
            border-radius: 30px;
            padding: 6px 14px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            transition: 0.2s;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        `;
        copyBtn.addEventListener('mouseenter', () => copyBtn.style.backgroundColor = '#3f51b5');
        copyBtn.addEventListener('mouseleave', () => copyBtn.style.backgroundColor = '#5c6bc0');
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            onCopy();
        });
        colHeader.appendChild(titleSpan);
        colHeader.appendChild(copyBtn);
        column.appendChild(colHeader);

        // 内容区域（滚动）
        const contentArea = document.createElement('div');
        contentArea.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            line-height: 1.6;
            font-size: 15px;
        `;

        // 渲染每个段落（带序号）
        for (let i = 0; i < paragraphs.length; i++) {
            const paraWrapper = document.createElement('div');
            paraWrapper.style.cssText = `
                margin-bottom: 20px;
                border-left: 3px solid #ff9800;
                padding-left: 12px;
                background: rgba(255,255,255,0.6);
                border-radius: 0 8px 8px 0;
            `;
            const indexSpan = document.createElement('div');
            indexSpan.style.cssText = `
                font-size: 12px;
                color: #888;
                margin-bottom: 6px;
                font-family: monospace;
            `;
            indexSpan.textContent = `第 ${i+1} 段`;
            const paraText = document.createElement('div');
            paraText.style.whiteSpace = 'pre-wrap';
            paraText.style.wordBreak = 'break-word';
            paraText.textContent = paragraphs[i];
            paraWrapper.appendChild(indexSpan);
            paraWrapper.appendChild(paraText);
            contentArea.appendChild(paraWrapper);
        }

        column.appendChild(contentArea);
        return column;
    }

    init();
})();