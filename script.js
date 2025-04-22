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
        let isOpen = false;
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        const dropdownButton = dropdown.querySelector('.dropbtn');

        // Function to show dropdown
        const showDropdown = () => {
            clearTimeout(timeoutId);
            dropdownContent.style.visibility = 'visible';
            dropdownContent.style.opacity = '1';
            dropdownContent.style.transform = 'translateY(0)';
            dropdownContent.style.transitionDelay = '0s';
        };

        // Function to hide dropdown
        const hideDropdown = () => {
            dropdownContent.style.visibility = 'hidden';
            dropdownContent.style.opacity = '0';
            dropdownContent.style.transform = 'translateY(-10px)';
            isOpen = false;
            dropdown.classList.remove('active');
        };

        // Function to toggle active state
        const toggleActive = (active) => {
            if (active) {
                dropdown.classList.add('active');
            } else {
                dropdown.classList.remove('active');
            }
        };

        // When mouse enters the dropdown
        dropdown.addEventListener('mouseenter', () => {
            if (!isOpen) {
                showDropdown();
            }
        });

        // When mouse leaves the dropdown
        dropdown.addEventListener('mouseleave', () => {
            // Set a timeout to hide the dropdown after a delay
            if (!isOpen) {
                timeoutId = setTimeout(() => {
                    hideDropdown();
                }, 800); // 800ms delay before hiding
            }
        });

        // When mouse enters the dropdown content
        dropdownContent.addEventListener('mouseenter', () => {
            if (!isOpen) {
                clearTimeout(timeoutId);
            }
        });

        // When mouse leaves the dropdown content
        dropdownContent.addEventListener('mouseleave', () => {
            if (!isOpen) {
                timeoutId = setTimeout(() => {
                    hideDropdown();
                }, 500); // 500ms delay before hiding when leaving the content
            }
        });

        // Toggle dropdown on button click
        dropdownButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (isOpen) {
                // If already open, close it
                hideDropdown();
                toggleActive(false);
            } else {
                // If closed, open it and set a longer timeout
                showDropdown();
                isOpen = true;
                toggleActive(true);

                // Auto-close after 3 seconds
                timeoutId = setTimeout(() => {
                    hideDropdown();
                    toggleActive(false);
                }, 3000); // 3 seconds
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (isOpen && !dropdown.contains(e.target)) {
                hideDropdown();
            }
        });
    });
});
