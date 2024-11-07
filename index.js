console.log("Weather app");

const weather_condition = document.querySelector(".weather_condition");
const search_button = document.getElementById("btn");
const input_field = document.getElementById("input");
const condition = document.querySelector(".condition");
const input_container = document.querySelector(".input_container");
const weather_info = document.querySelector(".weather-info");
const city_name = document.querySelector(".city-name");
const temp = document.querySelector(".temp");
const humidity = document.querySelector(".humidity_data");
const wind_speed = document.querySelector(".wind_speed_data");
const fills_like = document.querySelector(".fills_like_data");

const location_user = document.querySelector(".access_location");
const container = document.querySelector(".container");
const loading = document.querySelector(".loading");

const key = "82005d27a116c2880c8f0fcb866998a0";

document.addEventListener('DOMContentLoaded', getUserLocation);

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => fetchWeather({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }),
            () => {
                location_user.classList.add("active");
                location_user.addEventListener("click", requestLocationAccess);
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

function requestLocationAccess() {
    navigator.geolocation.getCurrentPosition(
        (position) => fetchWeather({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }),
        () => {
            alert("Please enable location services to get weather data.");
            location_user.classList.remove("active");
        }
    );
}

async function fetchWeather({ latitude, longitude }) {
    try {
        showLoading();
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`);
        const data = await response.json();

        if (data.cod === 200) {
            displayUpdate(data);
        } else {
            showErrorMessage("Error fetching weather data: " + data.message);
        }
    } catch (err) {
        showErrorMessage("Unable to fetch weather data. Please try again.");
    } finally {
        hideLoading();
    }
}

function displayUpdate(data) {
    city_name.innerHTML = `${data.name}, ${data.sys.country}`;
    temp.innerHTML = `${Math.floor(data.main.temp - 273.15)} °C`;
    humidity.innerHTML = `${data.main.humidity} %`;
    wind_speed.innerHTML = `${data.wind.speed} km/h`;
    fills_like.innerHTML = `${Math.floor(data.main.feels_like - 273.15)} °C`;
    condition.innerHTML = data.weather[0].description;

    const icon = data.weather[0].icon;
    document.getElementById("weatherIcon").src = `./images/${icon}.png`;

    setBackgroundColor(icon);
    weather_info.style.display = "block";
}

function setBackgroundColor(icon) {
    container.classList.remove("day", "night");

    if (icon === "01d") {
        container.classList.add("day");
    } else if (icon === "01n") {
        container.classList.add("night");
    }
}

search_button.addEventListener("click", handleClick);
input_field.addEventListener("keydown", (event) => {
    if (event.key === "Enter") handleClick();
});

function handleClick() {
    const city = input_field.value.trim();

    if (city === "") {
        showErrorMessage("Please enter a city name.");
        return;
    }

    hideErrorMessage();  
    showLoading();
    weather_info.style.display = "none";
    getCoordinates(city);
}

async function getCoordinates(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`);
        const data = await response.json();

        if (data.cod === 200) {
            displayUpdate(data);
        } else {
            showErrorMessage("City not found. Make sure you enter the correct city.");
        }
    } catch {
        showErrorMessage("Error occurred while fetching coordinates.");
    } finally {
        hideLoading();
    }
}

function showErrorMessage(message) {
    weather_info.style.display = "none";
    const errorMessage = document.querySelector(".error-message");
    errorMessage.style.display = "block";
    errorMessage.textContent = message;
}

function hideErrorMessage() {
    const errorMessage = document.querySelector(".error-message");
    errorMessage.style.display = "none";
}

function showLoading() {
    loading.style.display = "block";
}

function hideLoading() {
    loading.style.display = "none";
}
