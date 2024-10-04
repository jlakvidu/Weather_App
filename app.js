document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "32fdc8caf5b443699ef94924240410";
    const timeZoneApiKey = "GPF627FUYAH0";
    const searchButton = document.getElementById("searchButton");
    const locationButton = document.getElementById("locationButton");
    const darkModeToggle = document.getElementById("darkModeToggle");

    searchButton.addEventListener("click", () => {
        const city = document.getElementById("search").value;   
        if (city) fetchWeatherData(city);
    });

    locationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherData(null, latitude, longitude);
                // Save coordinates in session storage for use in map.html
                sessionStorage.setItem('latitude', latitude);
                sessionStorage.setItem('longitude', longitude);
                window.location.href = "map.html"; // Redirect to map page
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    });

    darkModeToggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode", darkModeToggle.checked);
    });

    function fetchWeatherData(city, lat = null, lon = null) {
        let weatherApiURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&days=5&hourly=1`;
        weatherApiURL += city ? `&q=${city}` : `&q=${lat},${lon}`;

        fetch(weatherApiURL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Location not found");
                }
                return response.json();
            })
            .then((data) => {
                updateUI(data);
                const { lat, lon } = data.location;
                fetchTimeZone(lat, lon);
            })
            .catch((error) => {
                if (error.message === "Location not found") {
                    alert("Invalid location. Please enter a valid country, city, or village.");
                } else {
                    console.error("Error fetching weather data:", error);
                }
            });
    }

    function fetchTimeZone(lat, lon) {
        const timezoneApiURL = `https://api.timezonedb.com/v2.1/get-time-zone?key=${timeZoneApiKey}&format=json&by=position&lat=${lat}&lng=${lon}`;

        fetch(timezoneApiURL)
            .then((response) => response.json())
            .then((data) => updateTime(data))
            .catch((error) => console.error("Error fetching time zone data:", error));
    }

    function updateUI(data) {
        document.getElementById("cityName").textContent = data.location.name;
        document.getElementById("temperature").textContent = `${data.current.temp_c}°C`;
        document.getElementById("feelsLike").textContent = `${data.current.feelslike_c}°C`;
        document.getElementById("weatherCondition").textContent = data.current.condition.text;
        document.getElementById("humidity").textContent = `${data.current.humidity}%`;
        document.getElementById("windSpeed").textContent = `${data.current.wind_kph} km/h`;
        document.getElementById("pressure").textContent = `${data.current.pressure_mb} hPa`;
        document.getElementById("sunrise").textContent = data.forecast.forecastday[0].astro.sunrise;
        document.getElementById("sunset").textContent = data.forecast.forecastday[0].astro.sunset;

        const weatherIcon = document.getElementById("weatherIcon");
        const iconCode = data.current.condition.icon;
        weatherIcon.src = `https:${iconCode}`;

        const forecastItems = document.querySelector(".five-days-forecast");
        forecastItems.innerHTML = ""; // Clear previous forecast items

        data.forecast.forecastday.forEach((day, index) => {
            if (index < 5) {
                const item = document.createElement("div");
                item.className = "col forecast-item p-3 bg-gradient rounded shadow-sm";
                item.innerHTML = `
                    <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" class="img-fluid mb-2 rounded-circle">
                    <p class="font-weight-bold">${day.day.avgtemp_c}°C</p>
                    <p>${new Date(day.date).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "short" })}</p>
                `;
                forecastItems.appendChild(item);
            }
        });

        const hourlyItems = document.querySelector(".hourly-forecast");
        hourlyItems.innerHTML = ""; // Clear previous hourly forecast items

        data.forecast.forecastday[0].hour.slice(0, 5).forEach((hour) => {
            const item = document.createElement("div");
            item.className = "col forecast-item p-3 bg-gradient rounded shadow-sm";
            item.innerHTML = `
                <p>${new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <img src="https:${hour.condition.icon}" alt="${hour.condition.text}" class="img-fluid mb-2 rounded-circle">
                <p class="font-weight-bold">${hour.temp_c}°C</p>
            `;
            hourlyItems.appendChild(item);
        });
    }

    function updateTime(data) {
        const date = new Date(data.formatted);
        const options = { weekday: "long", day: "numeric", month: "short" };
        document.getElementById("date").textContent = date.toLocaleDateString("en-US", options);
        document.getElementById("time").textContent = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    }
});
