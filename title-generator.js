/* ==================================================
   IGNORED WORDS
================================================== */
const ignoredWords = new Set([
    "أنا", "انا", "أريد", "اريد", "أحتاج", "احتاج", "أرغب", "ارغب",
    "أريدك", "اريدك", "ممكن", "يمكن", "ساعدني", "ساعديني", "أعطني",
    "اعطني", "اشرح", "اشرحي", "أخبرني", "اخبريني", "من", "في", "فى",
    "على", "عن", "إلى", "الى", "مع", "بين", "لدى", "حتى", "هو", "هي",
    "هم", "هذا", "هذه", "ذلك", "تلك", "الذي", "التي", "الذين", "و",
    "أو", "او", "ثم", "لكن", "بل", "أن", "ان", "إن", "إذا", "اذا",
    "لو", "لقد", "قد", "ليس", "لا", "لم", "لن", "ماذا", "كيف", "لماذا",
    "متى", "أين", "هل", "كل", "أي", "اي", "كان", "كانت", "يكون", "تكون"
]);

/* ==================================================
   NORMALIZE WORD
================================================== */
function normalizeWord(word) {
    return word
        .toLowerCase()
        .trim()
        .replace(/[ًٌٍَُِّْـ]/g, "")
        .replace(/^ال/, "");
}

/* ==================================================
   LIMIT TITLE
================================================== */
function limitTitle(title, maxLength = 15) {
    title = String(title || "").trim().replace(/\s+/g, " ");

    if (title.length <= maxLength) {
        return title;
    }

    const words = title.split(" ");

    let result = "";

    for (const word of words) {
        const test = result ? result + " " + word : word;

        if (test.length <= maxLength) {
            result = test;
        } else {
            break;
        }
    }

    if (!result) {
        return title.slice(0, maxLength);
    }

    return result;
}

/* ==================================================
   GENERATE TITLE
================================================== */
function generateChatTitle(text) {
    const words = String(text || "")
        .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(word => word.length >= 3);

    const frequency = {};
    const originalWords = {};

    words.forEach(word => {
        const normalized = normalizeWord(word);

        if (normalized.length < 3) {
            return;
        }

        if (ignoredWords.has(normalized) || ignoredWords.has(word)) {
            return;
        }

        frequency[normalized] = (frequency[normalized] || 0) + 1;

        if (!originalWords[normalized]) {
            originalWords[normalized] = word;
        }
    });

    const sorted = Object.entries(frequency).sort((a, b) => b[1] - a[1]);

    let titleWords = sorted.slice(0, 2).map(item => originalWords[item[0]]);

    if (titleWords.length === 0) {
        titleWords = words.slice(0, 2);
    }

    return limitTitle(titleWords.join(" "), 15) || "محادثة جديدة";
}
