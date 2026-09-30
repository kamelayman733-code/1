/* ==================================================
   CLEAN SPEECH TEXT
================================================== */
function cleanSpeechText(text) {
    if (!text) {
        return "";
    }

    let result = String(text);

    /* أسماء مهمة */
    result = result.replace(/\bSEYRAN\b/gi, "سيران");
    result = result.replace(/\bSeyran\b/gi, "سيران");
    result = result.replace(/\bKamel\s+Ayman\b/gi, "كامل أيمن");
    result = result.replace(/\bKamel\b/gi, "كامل");
    result = result.replace(/\bAyman\b/gi, "أيمن");

    /* كلمات تقنية */
    const replacements = {
        "HTML": "إتش تي إم إل",
        "CSS": "سي إس إس",
        "JavaScript": "جافاسكريبت",
        "Javascript": "جافاسكريبت",
        "JS": "جافاسكريبت",
        "API": "إيه بي آي",
        "APIs": "إيه بي آيز",
        "JSON": "جيسون",
        "URL": "يو آر إل",
        "HTTP": "إتش تي تي بي",
        "HTTPS": "إتش تي تي بي إس",
        "GitHub": "جيت هاب",
        "Git": "جيت",
        "Firebase": "فايربيس",
        "Gemini": "جيميني",
        "Google": "جوجل",
        "Microsoft": "مايكروسوفت",
        "Windows": "ويندوز",
        "Android": "أندرويد",
        "Chrome": "كروم",
        "Edge": "إيدج",
        "Python": "بايثون",
        "Flask": "فلاسك",
        "Node.js": "نود جي إس",
        "Node": "نود",
        "React": "رياكت",
        "Vue": "فيو",
        "Angular": "أنجولار",
        "SQL": "إس كيو إل",
        "MySQL": "ماي إس كيو إل",
        "Frontend": "الواجهة الأمامية",
        "Front-end": "الواجهة الأمامية",
        "Backend": "الواجهة الخلفية",
        "Back-end": "الواجهة الخلفية",
        "Full Stack": "التطوير المتكامل",
        "AI": "الذكاء الاصطناعي",
        "WiFi": "واي فاي",
        "Wi-Fi": "واي فاي",
        "PC": "حاسوب",
        "CPU": "المعالج",
        "GPU": "معالج الرسوميات",
        "RAM": "الذاكرة",
        "SSD": "إس إس دي",
        "USB": "يو إس بي"
    };

    Object.entries(replacements).forEach(([english, arabic]) => {
        const escaped = english.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escaped, "gi");
        result = result.replace(regex, arabic);
    });

    /* إزالة Markdown */
    result = result.replace(/```[\s\S]*?```/g, "");
    result = result.replace(/`([^`]+)`/g, "$1");
    result = result.replace(/\*\*(.*?)\*\*/g, "$1");
    result = result.replace(/\*(.*?)\*/g, "$1");
    result = result.replace(/__(.*?)__/g, "$1");
    result = result.replace(/_(.*?)_/g, "$1");
    result = result.replace(/^\s*#{1,6}\s*/gm, "");
    result = result.replace(/\*\*|\\\*/g, "");

    /* إزالة الروابط */
    result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

    /* إزالة الأقواس والرموز */
    result = result.replace(/[()[\]{}<>]/g, " ");
    result = result.replace(/[*#_~`|\\]/g, " ");
    result = result.replace(/[=+*/^%$@]/g, " ");
    result = result.replace(/-{2,}/g, " ");

    /* إزالة الإيموجي */
    result = result.replace(/[\u{1F300}-\u{1FAFF}]/gu, " ");

    /* رموز خاصة */
    result = result.replace(/[©®™✓✔✖✕★☆●○◆◇■□►▶◀◁]/g, " ");

    /* المسافات */
    result = result.replace(/\s+/g, " ").trim();

    return result;
}

/* ==================================================
   CLEAN DISPLAY TEXT
================================================== */
function cleanDisplayText(text) {
    if (!text) {
        return "";
    }

    let result = String(text);

    /* إزالة Code Blocks */
    result = result.replace(/```[\s\S]*?```/g, "");

    /* Markdown Links */
    result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

    /* العناوين */
    result = result.replace(/^\s*#{1,6}\s*/gm, "");

    /* Bold */
    result = result.replace(/\*\*(.*?)\*\*/g, "$1");

    /* Italic */
    result = result.replace(/\*(.*?)\*/g, "$1");

    result = result.replace(/__(.*?)__/g, "$1");
    result = result.replace(/_(.*?)_/g, "$1");

    /* Code */
    result = result.replace(/`([^`]+)`/g, "$1");

    /* إزالة علامات Markdown */
    result = result.replace(/[*#_~`|]/g, "");

    /* إزالة بعض الرموز */
    result = result.replace(/[<>[\]{}]/g, "");

    /* تحسين المسافات */
    result = result.replace(/\s+/g, " ").trim();

    return result;
}
