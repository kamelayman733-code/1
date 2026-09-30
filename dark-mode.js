/* ==================================================
   DARK MODE
================================================== */
let darkModeEnabled = false;

function toggleDarkMode() {
    darkModeEnabled = !darkModeEnabled;

    document.body.classList.toggle("dark-mode", darkModeEnabled);

    const darkMood = document.getElementById("darkmood");

    if (darkMood) {
       darkMood.innerHTML = darkModeEnabled
    ? 'Dark mood'
    : 'Light mood';
    }
}











function ktoggleMenu() {
    const e = document.getElementById('e');
    const btn = document.getElementById('menuBtn');

    e.classList.toggle('show');

    if (e.classList.contains('show')) {
        btn.textContent = '✕';
    } else {
        btn.textContent = '☰';
    }
}







function toggleMenu() {
    const e = document.getElementById('e');
    e.classList.toggle('show');
}