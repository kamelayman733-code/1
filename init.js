/* ==================================================
   INIT
================================================== */
function initSEYRAN() {
    if (currentChatId && conversations[currentChatId]) {
        loadChat(currentChatId);
    } else {
        const ids = Object.keys(conversations);

        if (ids.length > 0) {
            ids.sort((a, b) => conversations[b].updatedAt - conversations[a].updatedAt);
            loadChat(ids[0]);
        } else {
            createChat();
        }
    }

    renderHistory();
    updateButton();

    if ("speechSynthesis" in window) {
        speechSynthesis.getVoices();
    }

    if (!SpeechRecognition) {
        console.warn("SpeechRecognition غير مدعوم.");
    }
}

/* ==================================================
   START
================================================== */
initSEYRAN();
