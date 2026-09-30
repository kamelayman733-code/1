/* ==================================================
   TYPEWRITER EFFECT
================================================== */
function typeMessage(element, text, speed = 20) {
    if (!element) {
        return;
    }

    element.textContent = "";
    let index = 0;

    function typeNext() {
        if (index >= text.length) {
            element.textContent = text;
            chat.scrollTop = chat.scrollHeight;
            return;
        }

        element.textContent += text[index];
        index++;

        chat.scrollTop = chat.scrollHeight;

        setTimeout(typeNext, speed);
    }

    typeNext();
}
