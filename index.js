console.log("weather app");
const search_button = document.getElementById("btn");
const input_field = document.getElementById("input");
const your_weather = document.getElementById("your_weather");
const search_weather = document.getElementById("search_weather");
const input_container = document.querySelector(".input_container");
const weather_info = document.querySelector(".weather-info");
const city_name = document.querySelector(".city-name");
const temp = document.querySelector(".temp");
const humidity = document.querySelector(".humidity_data");
const wind_speed = document.querySelector(".wind_speed_data");
const fills_like = document.querySelector(".fills_like_data");
const grant_access = document.querySelector(".grant_access");
const location_user = document.querySelector(".access_location");

let key = "82005d27a116c2880c8f0fcb866998a0";
let data;

grant_access.classList.remove("active");

async function weather(coordinate) {
    if (!coordinate) {
        console.error("No coordinate provided");
        return;
    }

    const { latitude, longitude } = coordinate;

    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`);
        data = await response.json();
    } catch (err) {
        console.log("Error occurred in fetching the data", err);
    }

    displayUpdate();
    console.log(data);
}

location_user.addEventListener("click", ()=>{
  handleYourWeather()
})

function displayUpdate() {
    console.log("updating the name and data");

    city_name.innerHTML = " ";
    city_name.innerHTML = data.name;

    let kelvine = data.main.temp;
    const calcius = kelvine - 273.15;
    temp.innerHTML = Math.floor(calcius) + " " + "°C";

    humidity.innerHTML = data.main.humidity + " " + " %";

    wind_speed.innerHTML = data.wind.speed + " " + "km /hr";

    let fells = data.main.feels_like;
    const convert_feels = fells - 273.15;
    fills_like.innerHTML = Math.floor(convert_feels);
}

search_button.addEventListener("click", handleClick);
your_weather.addEventListener("click", handleYourWeather);
search_weather.addEventListener("click", handleSearchWeather);

function handleClick() {
    console.log(input_field.value);
    getCoordinates(input_field.value);

    if (input_field.value === "") {
        return;
    } else {
        weather_info.classList.remove("active");
        grant_access.classList.add("active");
    }
}

function handleYourWeather() {
    console.log("The button is clicked");
    input_container.classList.add("active");
    weather_info.classList.remove("active");
    grant_access.classList.remove("grant_access");

    getUserLocation();
}

function handleSearchWeather() {
    input_container.classList.remove("active");
    weather_info.classList.add("active");
}

function getUserLocation() {
    console.log("Fetching user location...");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                weather(coordinates);
                grant_access.classList.add("active");
            },
            (error) => {
                console.error("Error getting location:", error);
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

async function getCoordinates(city) {
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`);
        let data = await response.json();

        if (data.cod === 200) {
            const coordinates = {
                latitude: data.coord.lat,
                longitude: data.coord.lon,
            };
            weather(coordinates);
            grant_access.classList.add("active");
        } else {
            console.error("City not found:", data.message);
        }
    } catch (err) {
        console.error("Error occurred while fetching coordinates:", err);
    }
}
