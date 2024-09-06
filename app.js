document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "fd091c84020448a584141337240609";
    const timeZoneApiKey = "GPF627FUYAH0";
    const searchButton = document.getElementById("searchButton");
    const locationButton = document.getElementById("locationButton");
    const darkModeToggle = document.getElementById("darkModeToggle");

    darkModeToggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode", darkModeToggle.checked);
    });
});
