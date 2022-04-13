const wrapper = document.querySelector(".wrapper");
const inputPart = wrapper.querySelector(".inp-sec");
const infoTxt = inputPart.querySelector(".info-txt");
const inputField = inputPart.querySelector("input");
const locbtn = inputPart.querySelector("button");
const apiKey = 'de4e1bdd3b3c9c8f64ac462e5e19d67d';
const icon = document.querySelector(".weather-sec img");
const arrow = wrapper.querySelector("header i");
let api;

inputField.addEventListener("keyup", e => {
    if (e.key == "Enter" && inputField.value !== "") {
        requestApi(inputField.value);
    }

});


locbtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onerror);
    }
    else {
        alert("Your browser doesnt't support geolocation api !!");
    }
})

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onerror(error) {
    infoTxt.innerHTML = error.message;
    infoTxt.classList.add("error");
}

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    fetchData();
}

function fetchData() {
    infoTxt.innerHTML = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
    if (info.cod == "404") {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerHTML = `${inputField.value} isn't a valid city name`;
    }
    else {
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;

        if (id == 800) {
            icon.src = "weather-icons/clear.png"
        }
        else if (id >= 200 && id <= 232) {
            icon.src = "weather-icons/storm.png";
        }
        else if (id >= 801 && id <= 804) {
            icon.src = "weather-icons/cloud.png";
        }
        else if (id >= 701 && id <= 781) {
            icon.src = "weather-icons/haze.png";
        }
        else if (id >= 600 && id <= 622) {
            icon.src = "weather-icons/snow.png";
        }
        else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            icon.src = "weather-icons/rainy.png";
        }

        wrapper.querySelector(".temp .numb").innerHTML = Math.floor(temp);
        wrapper.querySelector(".weather").innerHTML = description;
        wrapper.querySelector(".location span").innerHTML = `${city},${country}`;
        wrapper.querySelector(".temp .numb-2").innerHTML = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerHTML = `${humidity}%`;

        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
        //document.body.style.backgroundImage="URL('https://source.unsplash.com/1600x900/?"+city+"')";
    }
}
arrow.addEventListener("click", () => {
    wrapper.classList.remove("active");
})