// 🔑 Step 1: Add your API key
const apiKey = "2f6976af8b7b33a7d5323c1e39237b20";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

// 🔍 Get HTML elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityEl = document.getElementById("city");
const tempEl = document.getElementById("temperature");
const descEl = document.getElementById("description");
const iconEl = document.getElementById("icon");
const weatherContainer = document.getElementById("weather-container");


// 🌤 Display Weather
function displayWeather(data) {
    cityEl.textContent = data.name;

    tempEl.textContent =
        "Temperature: " + data.main.temp + "°C";

    descEl.textContent =
        data.weather[0].description;

    const iconCode = data.weather[0].icon;

    iconEl.src =
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Re-enable button
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";

    cityInput.focus();
}


// ❌ Show Error
function showError(message) {
    weatherContainer.innerHTML = `
        <div class="error-message">
            ❌ ${message}
        </div>
    `;

    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
}


// ⏳ Show Loading
function showLoading() {
    weatherContainer.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Fetching weather data...</p>
        </div>
    `;
}


// 🌍 Fetch Weather (Async/Await Version)
async function getWeather(city) {

    showLoading();

    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    const url = `${API_URL}?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);

        console.log(response.data);

        // Clear loading HTML
        weatherContainer.innerHTML = `
            <h2 id="city"></h2>
            <p id="temperature"></p>
            <p id="description"></p>
            <img id="icon" />
        `;

        // Reconnect elements after replacing innerHTML
        const newCityEl = document.getElementById("city");
        const newTempEl = document.getElementById("temperature");
        const newDescEl = document.getElementById("description");
        const newIconEl = document.getElementById("icon");

        newCityEl.textContent = response.data.name;
        newTempEl.textContent =
            "Temperature: " + response.data.main.temp + "°C";
        newDescEl.textContent =
            response.data.weather[0].description;
        newIconEl.src =
            `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;

        searchBtn.disabled = false;
        searchBtn.textContent = "Search";

    } catch (error) {

        console.log("Error:", error);

        if (error.response && error.response.status === 404) {
            showError("City not found. Please check spelling.");
        } else {
            showError("Something went wrong. Try again later.");
        }
    }
}


// 🔘 Button Click
searchBtn.addEventListener("click", function () {

    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    if (city.length < 2) {
        showError("City name too short.");
        return;
    }

    getWeather(city);

    cityInput.value = "";
});


// ⌨ Enter Key Support
cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});


// 🏠 Welcome message on page load
weatherContainer.innerHTML = `
    <p>🌍 Enter a city name to get started!</p>
`;