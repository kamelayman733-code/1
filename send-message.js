/* ==================================================
   SEND MESSAGE
================================================== */
async function sendMessage() {
    if (!messageInput) {
        return;
    }
    if (isSending) {
        return;
    }

    const text = messageInput.value.trim();
    if (!text) {
        return;
    }

    clearTimeout(silenceTimer);

    isSending = true;

    const currentChat = getCurrentChat();
    const firstMessage = currentChat.messages.length === 0;

    addMessage(text, "user");

    messageInput.value = "";
    messageInput.style.height = "400px";

    updateButton();

    if (firstMessage) {
        currentChat.title = generateChatTitle(text);
        currentChat.updatedAt = Date.now();
        saveConversations();
        renderHistory();
    }

    if (sendButton) {
        sendButton.disabled = true;
    }

    /* ==========================================
       سيران تفكر - ثلاث نقاط متحركة
    ========================================== */
    const loading = addMessage("", "ai", false);
    let dotCount = 0;
    const thinkingAnimation = setInterval(() => {
        dotCount++;
        if (dotCount > 3) {
            dotCount = 1;
        }
        if (loading) {
            loading.textContent = ".".repeat(dotCount);
        }
    }, 400);

    try {
        const answer = await askGemini();

        /* إيقاف نقاط التفكير */
        clearInterval(thinkingAnimation);

        /* تنظيف النص */
        const cleanAnswer = cleanDisplayText(answer);

        /* الكتابة حرفًا حرفًا */
        if (loading) {
            loading.className = "messageai";
            loading.textContent = "";
            typeMessage(loading, cleanAnswer, 20);
        }

        /* حفظ الرد الأصلي */
        saveMessage(answer, "ai");

        /* النطق */
        speakText(answer);

    } catch (error) {
        /* إيقاف نقاط التفكير عند الخطأ */
        clearInterval(thinkingAnimation);

        console.error("SEYRAN ERROR:", error);

        const errorMessage = String(error.message || "").toLowerCase();

        const quotaFinished =
            errorMessage.includes("429") ||
            errorMessage.includes("quota") ||
            errorMessage.includes("resource exhausted");

        let errorText;

        if (quotaFinished) {
            errorText = "لقد انتهى الاستخدام اليومي المتاح حاليًا.";

            autoVoiceMode = false;
            clearTimeout(restartTimer);
            clearTimeout(silenceTimer);
            stopVoiceRecognition();

            if ("speechSynthesis" in window) {
                speechSynthesis.cancel();
            }
            isSpeaking = false;

        } else {
            errorText = "حدث خطأ: " + error.message;
        }

        if (loading) {
            loading.textContent = cleanDisplayText(errorText);
            loading.className = "messageai";
        }

        saveMessage(errorText, "ai");

        if (quotaFinished) {
            speakText(errorText);
        }
    }

    isSending = false;

    if (sendButton) {
        sendButton.disabled = false;
    }

    updateButton();
}

/* ==================================================
   UPDATE BUTTON
================================================== */
function updateButton() {
    if (!sendButton) {
        return;
    }

    if (isListening) {
        sendButton.innerHTML = '<i class="fa-solid fa-stop"></i>';
        return;
    }

    if (messageInput && messageInput.value.trim()) {
        sendButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
        return;
    }

    sendButton.innerHTML = '<i class="fa-solid fa-microphone"></i>';
}
