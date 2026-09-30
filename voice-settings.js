/* ==================================================
   VOICE SETTINGS
================================================== */

const VOICE_RATE = 0.82;
const VOICE_PITCH = 0.85;
const VOICE_VOLUME = 0.95;

/* ==================================================
   VOICE STATE
================================================== */

let autoVoiceMode = false;
let isListening = false;
let isSpeaking = false;
let isSending = false;
let silenceTimer = null;
let restartTimer = null;

/* ==================================================
   SPEECH RECOGNITION SUPPORT
================================================== */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition = null;