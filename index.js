console.log("Weather app");

const search_button = document.getElementById("btn");
const input_field = document.getElementById("input");

const input_container = document.querySelector(".input_container");
const weather_info = document.querySelector(".weather-info");
const city_name = document.querySelector(".city-name");
const temp = document.querySelector(".temp");
const humidity = document.querySelector(".humidity_data");
const wind_speed = document.querySelector(".wind_speed_data");
const fills_like = document.querySelector(".fills_like_data");
const grant_access = document.querySelector(".grant_access");
const location_user = document.querySelector(".access_location");
const morning = document.querySelector(".morning");
const container = document.querySelector(".container");

let key = "82005d27a116c2880c8f0fcb866998a0";

document.addEventListener('DOMContentLoaded', () => {
    getUserLocation();
});

function getUserLocation() {
    console.log("Fetching user location...");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                console.log("User location:", coordinates);
                fetchWeather(coordinates);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to retrieve your location. Please enable location services.");
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
        alert("Geolocation is not supported by your browser.");
    }
}

async function fetchWeather(coordinates) {
    const { latitude, longitude } = coordinates;

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`);
        const data = await response.json();
        displayUpdate(data);

        if (data.cod === 200) {
            console.log(data);
            weather_info.classList.remove("active");
        } else {
            console.error("Error fetching weather data:", data.message);
            alert("Error fetching weather data: " + data.message);
        }
    } catch (err) {
        console.error("Error occurred while fetching weather data:", err);
        alert("Unable to fetch weather data. Please try again.");
    }
}

function displayUpdate(data) {
    city_name.innerHTML = data.name;

    let kelvine = data.main.temp;
    const calcius = kelvine - 273.15;
    temp.innerHTML = Math.floor(calcius) + " °C";

    humidity.innerHTML = data.main.humidity + " %";
    wind_speed.innerHTML = data.wind.speed + " km/h";

    let feels = data.main.feels_like;
    const convert_feels = feels - 273.15;
    fills_like.innerHTML = Math.floor(convert_feels);

    let sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    let sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

    console.log("Sunrise:", sunrise);
    console.log("Sunset:", sunset);

    let currentDate = new Date();
    let timeOfDay = getTimeOfDay(currentDate, data.sys.sunrise, data.sys.sunset);
    console.log("Time of Day: " + timeOfDay);

    applyBackgroundStyle(timeOfDay);
}

function getTimeOfDay(currentTime, sunriseTime, sunsetTime) {
    const sunrise = new Date(sunriseTime * 1000);
    const sunset = new Date(sunsetTime * 1000);

    if (currentTime < sunrise) {
        return "Morning";
    } else if (currentTime >= sunrise && currentTime < sunset) {
        return "Afternoon";
    } else {
        return "Evening";
    }
}

function applyBackgroundStyle(timeOfDay) {
    const container = document.querySelector(".container");

    switch (timeOfDay) {
        case "Morning":
            container.style.backgroundImage = "url('../images/sunrise.jpg')";
            break;
        case "Afternoon":
            container.style.backgroundImage = "url('../images/sunrise.jpg')";
            break;
        case "Evening":
            container.style.backgroundImage = "url('../images/sunset.jpg')";
            break;
        default:
            break;
    }

    container.style.backgroundSize = "cover";
    container.style.backgroundPosition = "center";
    container.style.backgroundRepeat = "no-repeat";
    container.style.height = "100vh";
    container.style.width = "100%";
}

search_button.addEventListener("click", handleClick);

function handleClick() {
    const city = input_field.value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    getCoordinates(city);
    resetActiveClasses();
}

async function getCoordinates(city) {
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`);
        let data = await response.json();

        if (data.cod === 200) {
            const coordinates = {
                latitude: data.coord.lat,
                longitude: data.coord.lon,
            };
            weather(coordinates);
        } else {
            alert("City not found, please try again.");
            console.error("City not found:", data.message);
        }
    } catch (err) {
        console.error("Error occurred while fetching coordinates:", err);
        alert("Error occurred while fetching coordinates.");
    }
}

async function weather(coordinate) {
    if (!coordinate) {
        console.error("No coordinate provided");
        return;
    }

    const { latitude, longitude } = coordinate;

    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`);
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error(data.message || "Failed to fetch weather data");
        }

        displayUpdate(data);

    } catch (err) {
        console.log("Error occurred in fetching the data", err);
        alert("Unable to fetch weather data. Please try again.");
    }
}

function resetActiveClasses() {
    if (weather_info) {
        weather_info.classList.remove("active");
    }
    if (grant_access) {
        grant_access.classList.remove("active");
    }
}
