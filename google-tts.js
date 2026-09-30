/* ==================================================
   GOOGLE CLOUD TEXT-TO-SPEECH
   ==================================================
   عشان تشغّل صوت "بنت صغيرة" حقيقي (مش صوت المتصفح
   المحدود)، بنستخدم خدمة Google Cloud Text-to-Speech.

   خطوات التفعيل:
   1) افتح Google Cloud Console وفعّل خدمة
      "Cloud Text-to-Speech API" على مشروعك.
   2) لازم تفعيل الفوترة (Billing) على المشروع — الخدمة
      فيها حصة مجانية شهرية، وبعدها بتتحاسب بالاستخدام.
   3) اعمل API Key من صفحة Credentials وحطّه مكان
      GOOGLE_TTS_API_KEY تحت.
   4) مهم جدًا: قيّد المفتاح (Restrict key) بحيث يشتغل
      فقط مع Cloud Text-to-Speech API، ومن نفس الدومين
      بتاعك (HTTP referrers)، عشان محدش يقدر يستخدمه
      غيرك حتى لو شافه في كود الواجهة الأمامية.

   تنبيه أمني: زي مفتاح Gemini بالظبط، أي مفتاح API هنا
   في كود الواجهة الأمامية يبقى ظاهر لأي زائر. للاستخدام
   الجماهيري الأفضل نقل هذا الاستدعاء لخادم خلفي.
================================================== */
const GOOGLE_TTS_API_KEY = "PUT_YOUR_GOOGLE_TTS_API_KEY_HERE";

/* اسم الصوت ولغة النطق.
   ar-XA-Wavenet-A صوت أنثوي عربي بجودة Wavenet العالية. */
const TTS_LANGUAGE_CODE = "ar-XA";
const TTS_VOICE_NAME = "ar-XA-Wavenet-A";
const TTS_VOICE_GENDER = "FEMALE";

/* رفع الطبقة الصوتية (pitch) يخلي الصوت يحس إنه أصغر سنًا.
   المدى المسموح به: من -20 إلى 20. القيم الأعلى = صوت أنعم/أصغر،
   لكن لو رفعتها كتير جدًا هيبقى صوت مصطنع وغير طبيعي.
   speakingRate بيتحكم في سرعة الكلام (1 = طبيعي). */
const TTS_PITCH = 6.0;
const TTS_SPEAKING_RATE = 1.05;

/* الصوت اللي بيتشغل حاليًا، عشان نقدر نوقفه لو احتجنا */
let currentTTSAudio = null;

/* ==================================================
   طلب الصوت من Google Cloud TTS وتشغيله
   بيرجع Promise<boolean>: true لو نجح التشغيل بالكامل
================================================== */
async function speakWithGoogleTTS(speechText) {
    if (!GOOGLE_TTS_API_KEY || GOOGLE_TTS_API_KEY === "PUT_YOUR_GOOGLE_TTS_API_KEY_HERE") {
        console.warn("Google TTS: لم يتم ضبط مفتاح API، سيتم استخدام صوت المتصفح كبديل.");
        return false;
    }

    try {
        const response = await fetch(
            "https://texttospeech.googleapis.com/v1/text:synthesize?key=" +
                encodeURIComponent(GOOGLE_TTS_API_KEY),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    input: { text: speechText },
                    voice: {
                        languageCode: TTS_LANGUAGE_CODE,
                        name: TTS_VOICE_NAME,
                        ssmlGender: TTS_VOICE_GENDER
                    },
                    audioConfig: {
                        audioEncoding: "MP3",
                        pitch: TTS_PITCH,
                        speakingRate: TTS_SPEAKING_RATE
                    }
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Google TTS error:", response.status, errorText);
            return false;
        }

        const data = await response.json();

        if (!data.audioContent) {
            console.error("Google TTS: لم يتم استلام صوت من الخادم.");
            return false;
        }

        await playBase64Audio(data.audioContent);
        return true;

    } catch (error) {
        console.error("Google TTS request failed:", error);
        return false;
    }
}

/* ==================================================
   تشغيل صوت MP3 مُرمّز بصيغة base64
================================================== */
function playBase64Audio(base64Audio) {
    return new Promise((resolve, reject) => {
        const audio = new Audio("data:audio/mp3;base64," + base64Audio);
        currentTTSAudio = audio;

        audio.onended = () => {
            isSpeaking = false;
            updateButton();

            if (autoVoiceMode) {
                scheduleMicrophoneRestart(3000);
            }

            resolve();
        };

        audio.onerror = event => {
            console.error("تعذّر تشغيل صوت Google TTS:", event);

            isSpeaking = false;
            updateButton();

            reject(event);
        };

        audio
            .play()
            .then(() => {
                isSpeaking = true;
                updateButton();
            })
            .catch(error => {
                console.error("تعذّر بدء تشغيل الصوت:", error);
                reject(error);
            });
    });
}

/* ==================================================
   إيقاف صوت Google TTS الحالي (لو شغّال)
================================================== */
function stopGoogleTTSAudio() {
    if (currentTTSAudio) {
        try {
            currentTTSAudio.pause();
            currentTTSAudio.currentTime = 0;
        } catch (error) {
            console.log(error);
        }
        currentTTSAudio = null;
    }
}
