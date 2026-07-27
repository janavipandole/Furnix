// System preference listener and theme initialization manager
document.addEventListener("DOMContentLoaded", () => {
    if (window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
            const hasUserChoice = localStorage.getItem("theme");
            if (!hasUserChoice) {
                const newTheme = e.matches ? "dark" : "light";
                document.documentElement.setAttribute("data-theme", newTheme);
                const themeIcon = document.getElementById("themeIcon");
                if (themeIcon) {
                    if (newTheme === "dark") {
                        themeIcon.classList.remove("fa-moon");
                        themeIcon.classList.add("fa-sun");
                    } else {
                        themeIcon.classList.remove("fa-sun");
                        themeIcon.classList.add("fa-moon");
                    }
                }
            }
        });
    }
});
