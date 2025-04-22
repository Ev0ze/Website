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

    // Enhanced dropdown menu behavior
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        let timeoutId;
        const dropdownContent = dropdown.querySelector('.dropdown-content');

        // When mouse enters the dropdown
        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
            dropdownContent.style.visibility = 'visible';
            dropdownContent.style.opacity = '1';
            dropdownContent.style.transform = 'translateY(0)';
            dropdownContent.style.transitionDelay = '0s';
        });

        // When mouse leaves the dropdown
        dropdown.addEventListener('mouseleave', () => {
            // Set a timeout to hide the dropdown after a delay
            timeoutId = setTimeout(() => {
                dropdownContent.style.visibility = 'hidden';
                dropdownContent.style.opacity = '0';
                dropdownContent.style.transform = 'translateY(-10px)';
            }, 800); // 800ms delay before hiding
        });

        // When mouse enters the dropdown content
        dropdownContent.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
        });

        // When mouse leaves the dropdown content
        dropdownContent.addEventListener('mouseleave', () => {
            timeoutId = setTimeout(() => {
                dropdownContent.style.visibility = 'hidden';
                dropdownContent.style.opacity = '0';
                dropdownContent.style.transform = 'translateY(-10px)';
            }, 500); // 500ms delay before hiding when leaving the content
        });
    });
});
