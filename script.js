function switchTheme() {
    const themes = ["macchiato", "mocha"];
    const buttonLabels = {
        "mocha": "Light",
        "macchiato": "Dark"
    };
    const currentTheme = document.body.classList.contains("macchiato") ? "macchiato" : "mocha";
    let currentThemeIndex = themes.indexOf(currentTheme);
    document.body.classList.remove(themes[currentThemeIndex]);
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];
    document.body.classList.add(newTheme);
    document.getElementById("themeSwitcher").innerText = buttonLabels[newTheme];
}

function scrollToSection(id) {
    if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
        document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    Splitting();
    document.querySelectorAll(".rotating-text .char").forEach((char, index) => {
        char.style.setProperty("--char-index", index);
    });
});
