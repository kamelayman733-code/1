/* ==================================================
   SEND / MICROPHONE
================================================== */
if (sendButton) {
    sendButton.addEventListener("click", () => {

        if (isListening) {
            autoVoiceMode = false;
            stopVoiceRecognition();
            updateButton();
            return;
        }

        if (isSpeaking) {
            return;
        }

        if (messageInput && messageInput.value.trim()) {
            sendMessage();
            return;
        }

        autoVoiceMode = true;

        clearTimeout(restartTimer);

        startVoiceRecognition();
    });
}

/* ==================================================
   INPUT
================================================== */
if (messageInput) {
    messageInput.addEventListener("input", () => {
        messageInput.style.height = "auto";
        messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + "px";

        updateButton();
    });

    messageInput.addEventListener("keydown", event => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
}

/* ==================================================
   NEW CHAT
================================================== */
if (newChatButton) {
    newChatButton.addEventListener("click", () => {
        autoVoiceMode = false;

        clearTimeout(silenceTimer);
        clearTimeout(restartTimer);

        stopVoiceRecognition();

        if ("speechSynthesis" in window) {
            speechSynthesis.cancel();
        }

        isSpeaking = false;
        isSending = false;

        createChat();

        updateButton();
    });
}

/* ==================================================
   DELETE ALL
================================================== */
if (deleteAllButton) {
    deleteAllButton.addEventListener("click", deleteAllChats);
}
