const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "5b28361e4d3a1189171fd090155607ac"; 

// Function to get day name from a date
const getDayName = (dateString) => {
    const date = new Date(dateString);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
}

// Create weather card with custom image paths
const createWeatherCard = (cityName, weatherItem, index) => {
    const date = new Date(weatherItem.dt_txt);
    const formattedDate = `${getDayName(weatherItem.dt_txt)}, ${date.getDate()}/${date.getMonth() + 1}`;

    // Define custom weather icons based on weather code
    const weatherIcons = {
        "01d": "images/sun.png",
        "01n": "images/moon.png",
        "02d": "images/cloudy-day.png",
        "02n": "images/cloudy.png",
        "03d": "images/cloudy-day.png",
        "03n": "images/cloudy..png",
        "04d": "images/broken-clouds.png",
        "04n": "images/broken-clouds.png",
        "09d": "images/showers.png",
        "09n": "images/showers.png",
        "10d": "images/rain.png",
        "10n": "images/rain.png",
        "11d": "images/thunderstorm.png",
        "11n": "images/thunderstorm.png",
        "13d": "images/snow.png",
        "13n": "images/snow.png",
        "50d": "images/mist.png",
        "50n": "images/mist.png"
    };

    // Retrieve the icon based on the weather code
    const weatherCode = weatherItem.weather[0].icon;
    const iconPath = weatherIcons[weatherCode] || "images/default.png"; 

    if (index === 0) { // Main weather card
        return `
            <div class="details">
                <h2>${cityName} (${formattedDate})</h2>
                <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                <h6>Humidity: ${weatherItem.main.humidity}%</h6>
            </div>
            <div class="icon">
                <img src="${iconPath}" alt="weather-icon">
                <h6>${weatherItem.weather[0].description}</h6>
            </div>`;
    } else { // Forecast card
        return `
            <li class="card">
                <h3>${formattedDate}</h3>
                <img src="${iconPath}" alt="weather-icon">
                <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                <h6>Humidity: ${weatherItem.main.humidity}%</h6>
            </li>`;
    }
}

// Fetch weather details based on coordinates
const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        // Clear previous weather data
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        // Create and display weather cards
        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });
    }).catch(() => {
        alert("Error fetching weather data. Please try again later.");
    });
}

// Fetch city coordinates based on input
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(API_URL).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No data found for ${cityName}. Please try another city.`);
        const { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("Error fetching city coordinates. Please check your input or try again later.");
    });
}

// Fetch user coordinates and corresponding weather data
const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL).then(response => response.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("Error fetching city from coordinates. Please try again.");
            });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Location permission denied. Please enable location services and try again.");
            } else {
                alert("Error retrieving location. Please try again later.");
            }
        }
    );
}

// Event listeners
locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
