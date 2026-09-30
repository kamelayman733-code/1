/* ==================================================
   STORAGE
================================================== */
const STORAGE_KEY = "seyran_conversations_v1";
const CURRENT_CHAT_KEY = "seyran_current_chat_v1";

let conversations = {};
try {
    conversations = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
} catch (error) {
    console.error("خطأ في قراءة المحادثات:", error);
    conversations = {};
}

let currentChatId = localStorage.getItem(CURRENT_CHAT_KEY) || null;

/* ==================================================
   SAVE CONVERSATIONS
================================================== */
function saveConversations() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    localStorage.setItem(CURRENT_CHAT_KEY, currentChatId || "");
}

/* ==================================================
   CREATE CHAT
================================================== */
function createChat() {
    const id = "chat_" + Date.now();

    conversations[id] = {
        id: id,
        title: "محادثة جديدة",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: []
    };

    currentChatId = id;

    saveConversations();

    if (chat) {
        chat.innerHTML = "";
    }

    renderHistory();

    return id;
}

/* ==================================================
   CURRENT CHAT
================================================== */
function getCurrentChat() {
    if (!currentChatId || !conversations[currentChatId]) {
        createChat();
    }

    return conversations[currentChatId];
}

/* ==================================================
   SAVE MESSAGE
================================================== */
function saveMessage(text, type) {
    const currentChat = getCurrentChat();

    currentChat.messages.push({
        text: text,
        type: type,
        time: Date.now()
    });

    currentChat.updatedAt = Date.now();

    saveConversations();
    renderHistory();
}

/* ==================================================
   ADD MESSAGE
================================================== */
/* ==================================================
   ADD MESSAGE
================================================== */
function addMessage(text, type, save = true) {
    if (!chat) {
        return null;
    }

    /* الحاوية الرئيسية */
    const wrapper = document.createElement("div");
    wrapper.className = `message-wrapper ${type}`;

    /* الصورة */
    const avatar = document.createElement("img");
    avatar.className = "message-avatar";

    if (type === "user") {
        avatar.src = "IMG\\seyran_user_avatar_icon.png";
        avatar.alt = "User";
    } else {
        avatar.src = "IMG\\seyran_exact_pink_palette_icon.png";
        avatar.alt = "SEYRAN";
    }

    /* الرسالة */
    const div = document.createElement("div");

    if (type === "user") {
        div.className = "message";
    } else {
        div.className = "messageai";
    }

    div.textContent = text;

    /* ترتيب العناصر */
    wrapper.appendChild(avatar);
    wrapper.appendChild(div);

    chat.appendChild(wrapper);

    chat.scrollTop = chat.scrollHeight;

    /* حفظ الرسالة */
    if (save) {
        saveMessage(text, type);
    }

    return div;
}

/* ==================================================
   LOAD CHAT
================================================== */
function loadChat(id) {
    if (!conversations[id]) {
        return;
    }

    currentChatId = id;

    saveConversations();

    if (chat) {
        chat.innerHTML = "";

        conversations[id].messages.forEach(message => {
            addMessage(message.text, message.type, false);
        });
    }

    renderHistory();
}

/* ==================================================
   DELETE CHAT
================================================== */
function deleteChat(id) {
    if (!conversations[id]) {
        return;
    }

    delete conversations[id];

    const ids = Object.keys(conversations);

    if (currentChatId === id) {
        if (ids.length) {
            ids.sort((a, b) => conversations[b].updatedAt - conversations[a].updatedAt);

            currentChatId = ids[0];

            loadChat(currentChatId);
        } else {
            currentChatId = null;

            createChat();
        }
    }

    saveConversations();
    renderHistory();
}

/* ==================================================
   DELETE ALL
================================================== */
function deleteAllChats() {
    if (!confirm("هل تريد حذف جميع المحادثات؟")) {
        return;
    }

    autoVoiceMode = false;

    stopVoiceRecognition();

    if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
    }

    isSpeaking = false;
    isSending = false;

    conversations = {};
    currentChatId = null;

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_CHAT_KEY);

    createChat();
}

/* ==================================================
   HISTORY
================================================== */
function renderHistory() {
    if (!chatHistory) {
        return;
    }

    chatHistory.innerHTML = "";

    const ids = Object.keys(conversations).sort(
        (a, b) => conversations[b].updatedAt - conversations[a].updatedAt
    );

    ids.forEach(id => {
        const conversation = conversations[id];

        const item = document.createElement("div");
        item.className = "history-item";

        const button = document.createElement("button");
        button.textContent = conversation.title || "محادثة جديدة";
        button.title = conversation.title || "محادثة جديدة";

        if (id === currentChatId) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => {
            loadChat(id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteButton.title = "حذف المحادثة";

        deleteButton.addEventListener("click", event => {
            event.stopPropagation();

            if (confirm("هل تريد حذف هذه المحادثة؟")) {
                deleteChat(id);
            }
        });

        item.appendChild(button);
        item.appendChild(deleteButton);

        chatHistory.appendChild(item);
    });
}
