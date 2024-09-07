document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "fd091c84020448a584141337240609";
    const timeZoneApiKey = "GPF627FUYAH0";
    const searchButton = document.getElementById("searchButton");
    const locationButton = document.getElementById("locationButton");
    const darkModeToggle = document.getElementById("darkModeToggle");

    searchButton.addEventListener("click", () => {
        const city = document.getElementById("search").value;   
        if (city) fetchWeatherData(city);
    });
    
    darkModeToggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode", darkModeToggle.checked);
    });

    function updateTime(data) {
        const date = new Date(data.formatted);
        const options = { weekday: "long", day: "numeric", month: "short" };
        document.getElementById("date").textContent = date.toLocaleDateString("en-US", options);
        document.getElementById("time").textContent = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    }

});
