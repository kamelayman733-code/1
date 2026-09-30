/* ==================================================
   ARABIC MALE VOICE
================================================== */

function getBestArabicVoice() {
    if (!("speechSynthesis" in window)) {
        return null;
    }

    const voices = speechSynthesis.getVoices();

    if (!voices.length) {
        return null;
    }

    const preferredMaleNames = [
        "Maged",
        "Majed",
        "Tarik",
        "Tariq",
        "Naayf",
        "Hamed",
        "Omar",
        "Ahmed",
        "Mohamed",
        "Microsoft Hamed",
        "Microsoft Naayf",
        "Microsoft Omar"
    ];

    // البحث عن صوت عربي رجالي معروف
    for (const preferred of preferredMaleNames) {
        const voice = voices.find(v =>
            v.lang.toLowerCase().startsWith("ar") &&
            v.name.toLowerCase().includes(preferred.toLowerCase())
        );

        if (voice) {
            return voice;
        }
    }

    // لا تختار صوتًا عشوائيًا حتى لا يظهر صوت بنت
    return null;
}


/* ==================================================
   SPEAK FUNCTION
================================================== */

function speakText(text) {

    if (!("speechSynthesis" in window)) {
        return;
    }

    if (!text || !text.trim()) {
        return;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "ar-EG";

    utterance.rate = 0.95;
    utterance.pitch = 0.95;
    utterance.volume = 0.95;

    const voice = getBestArabicVoice();

    if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
    }

    speechSynthesis.speak(utterance);
}


/* ==================================================
   LOAD VOICES
================================================== */

if ("speechSynthesis" in window) {
    speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.getVoices();
    };
}