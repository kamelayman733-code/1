/* ==================================================
   CREATE RECOGNITION
================================================== */
function createRecognition() {
    if (!SpeechRecognition) {
        return null;
    }

    const instance = new SpeechRecognition();
    instance.lang = "ar-SA";
    instance.continuous = false;
    instance.interimResults = true;
    instance.maxAlternatives = 1;
    return instance;
}

/* ==================================================
   START VOICE RECOGNITION
================================================== */
function startVoiceRecognition() {
    if (!autoVoiceMode) {
        return;
    }
    if (isSpeaking) {
        return;
    }
    if (isSending) {
        return;
    }
    if (isListening) {
        return;
    }
    if (!SpeechRecognition) {
        alert("المتصفح لا يدعم التعرف على الصوت. استخدم Google Chrome أو Microsoft Edge.");
        return;
    }

    clearTimeout(silenceTimer);
    clearTimeout(restartTimer);

    recognition = createRecognition();

    if (!recognition) {
        return;
    }

    recognition.onstart = () => {
        isListening = true;
        clearTimeout(silenceTimer);
        updateButton();
        console.log("الميكروفون يعمل");
    };

    recognition.onresult = event => {
        let text = "";

        for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
        }

        text = text.trim();

        if (messageInput && text) {
            messageInput.value = text;
        }

        updateButton();

        clearTimeout(silenceTimer);

        if (text) {
            silenceTimer = setTimeout(() => {
                if (autoVoiceMode && isListening && messageInput && messageInput.value.trim()) {
                    try {
                        recognition.stop();
                    } catch (error) {
                        console.log(error);
                    }
                }
            }, 2000);
        }
    };

    recognition.onend = () => {
        isListening = false;

        clearTimeout(silenceTimer);

        updateButton();

        if (!autoVoiceMode) {
            return;
        }

        if (messageInput && messageInput.value.trim() && !isSending) {
            sendMessage();
            return;
        }

        scheduleMicrophoneRestart();
    };

    recognition.onerror = event => {
        console.error("Speech Recognition:", event.error);

        isListening = false;

        clearTimeout(silenceTimer);

        updateButton();

        if (!autoVoiceMode) {
            return;
        }

        if (event.error === "no-speech") {
            scheduleMicrophoneRestart(1000);
            return;
        }

        if (event.error === "not-allowed") {
            autoVoiceMode = false;
            alert("تم رفض صلاحية الميكروفون.");
            return;
        }

        if (event.error === "audio-capture") {
            autoVoiceMode = false;
            alert("لم يتم العثور على ميكروفون.");
            return;
        }

        scheduleMicrophoneRestart(1500);
    };

    try {
        recognition.start();
    } catch (error) {
        console.error("Recognition start:", error);

        isListening = false;

        scheduleMicrophoneRestart(1000);
    }
}

/* ==================================================
   RESTART MICROPHONE
================================================== */
function scheduleMicrophoneRestart(delay = 3000) {
    clearTimeout(restartTimer);

    if (!autoVoiceMode) {
        return;
    }

    restartTimer = setTimeout(() => {
        if (autoVoiceMode && !isListening && !isSpeaking && !isSending) {
            startVoiceRecognition();
        }
    }, delay);
}

/* ==================================================
   STOP VOICE
================================================== */
function stopVoiceRecognition() {
    clearTimeout(silenceTimer);
    clearTimeout(restartTimer);

    if (recognition) {
        try {
            recognition.stop();
        } catch (error) {
            console.log(error);
        }
    }

    isListening = false;

    updateButton();
}

/* ==================================================
   SPEAK TEXT
   يحاول أولًا صوت Google Cloud TTS (بنت صغيرة)،
   ولو فشل (مفيش مفتاح API أو حصل خطأ) بيرجع لصوت
   المتصفح العادي كحل بديل.
================================================== */
async function speakText(text) {
    if (!text) {
        return;
    }

    const speechText = cleanSpeechText(text);

    if (!speechText) {
        return;
    }

    clearTimeout(silenceTimer);

    if (recognition && isListening) {
        try {
            recognition.stop();
        } catch (error) {
            console.log(error);
        }
    }

    isListening = false;
    isSpeaking = true;

    clearTimeout(restartTimer);

    if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
    }
    stopGoogleTTSAudio();

    const playedWithGoogle = await speakWithGoogleTTS(speechText).catch(error => {
        console.error("Google TTS failed, falling back:", error);
        return false;
    });

    if (!playedWithGoogle) {
        speakWithBrowserVoice(speechText);
    }
}

/* ==================================================
   SPEAK WITH BROWSER VOICE (fallback)
================================================== */
function speakWithBrowserVoice(speechText) {
    if (!("speechSynthesis" in window)) {
        isSpeaking = false;
        updateButton();
        return;
    }

    const utterance = new SpeechSynthesisUtterance(speechText);

    utterance.lang = "ar-SA";
    utterance.rate = VOICE_RATE;
    utterance.pitch = VOICE_PITCH;
    utterance.volume = VOICE_VOLUME;

    const voice = getBestArabicVoice();

    if (voice) {
        utterance.voice = voice;
        utterance.lang = "ar-SA";
    }

    utterance.onstart = () => {
        isSpeaking = true;
        updateButton();
    };

    utterance.onend = () => {
        isSpeaking = false;
        updateButton();

        if (autoVoiceMode) {
            scheduleMicrophoneRestart(3000);
        }
    };

    utterance.onerror = event => {
        console.error("Speech:", event);

        isSpeaking = false;

        updateButton();

        if (autoVoiceMode) {
            scheduleMicrophoneRestart(3000);
        }
    };

    speechSynthesis.speak(utterance);
}
