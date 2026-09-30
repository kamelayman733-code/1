/* ==================================================
   GEMINI TEXT
================================================== */
function getGeminiText(data) {
    const text = data?.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("");

    return text?.trim() || null;
}

/* ==================================================
   ASK GEMINI
================================================== */
async function askGemini() {
    if (!API_KEY || API_KEY === "PUT_YOUR_NEW_GEMINI_API_KEY_HERE") {
        throw new Error("مفتاح Gemini غير موجود.");
    }

    const currentChat = getCurrentChat();

    const contents = currentChat.messages.map(message => ({
        role: message.type === "user" ? "user" : "model",
        parts: [{ text: message.text }]
    }));

    if (contents.length === 0) {
        throw new Error("لا توجد رسائل لإرسالها.");
    }

    const response = await fetch(API_URL + "?key=" + encodeURIComponent(API_KEY), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            systemInstruction: {
                parts: [{ text: SEYRAN_SYSTEM }]
            },
            contents: contents,
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7
            }
        })
    });

    let data = {};

    try {
        data = await response.json();
    } catch (error) {
        throw new Error("لم يتم استلام رد صحيح من الخادم.");
    }

    console.log("Gemini response:", data);

    if (!response.ok) {
        const errorMessage = data?.error?.message || "حدث خطأ في Gemini.";
        throw new Error(`Gemini ${response.status}: ${errorMessage}`);
    }

    const answer = getGeminiText(data);

    if (!answer) {
        throw new Error("Gemini لم يرجع نصًا.");
    }

    return answer;
}
