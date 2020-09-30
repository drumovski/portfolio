// imports personal key from file - key.js for use in axios to get data from weatherbit API
import {
  WEATHERBIT_KEY
} from "./keys.js";

// selecting all elements
const inputValue = document.querySelector(".inputValue");
const countryCode = document.querySelector(".countryCode");
const outputData = document.querySelector(".output-data");
const errorMessage = document.querySelector("#error-message");
const city = document.getElementById("city");
const currentImage = document.getElementById("current-image");
const temp = document.querySelector(".temp");
const tempCelcius = document.getElementById("tempCelcius");
const tempFarenheit = document.getElementById("tempFarenheit");
const allTemps = document.getElementsByClassName("temps")
const maxMin = document.getElementById("max-min");
const currentDate = document.querySelector("#current-date");
const description = document.getElementById("description");
const forcast = document.querySelector("#forcast");
const moreInfo = document.getElementById("more-info");
const moonPhase = document.getElementById("moon-phase");
const moonLine = document.getElementById("moon-line");
const windSpeed = document.getElementById("wind-speed");
const windGustSpeed = document.getElementById("wind-gust-speed");
const windDirection = document.getElementById("wind-direction");
const precipitation = document.getElementById("precipitation");
const uvIndex = document.getElementById("uv-index");
const timeZone = document.getElementById("time-zone");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const moonrise = document.getElementById("moonrise");
const moonset = document.getElementById("moonset");
const humidity = document.getElementById("humidity");
const moreInfoContainer = document.getElementById("more-info-container");
const allDays = document.getElementsByClassName("days");
// let dayMinCArr = [];
// let dayMaxCArr = [];
// let dayMinFArr = [];
// let dayMaxFArr = [];

const disappearExtraWeather = () => {
  // toggle hiding extra weather info and change button text
  // console.log("in hide");
  moreInfoContainer.style.display = "none";
  moreInfo.textContent = "More Info";
};

const appearExtraWeather = () => {
  // toggle hiding extra weather info and change button text
  // console.log("in show");
  moreInfoContainer.style.display = "block";
  moreInfo.textContent = "Less Info";
};

const getTime = (ts) => {
  // function takes UNIx timestamp and returns am/pm time
  let date = new Date(ts * 1000); // x1000 due to JS requiring miliseconds
  let ampm = "pm"; // default set to pm
  let hours = date.getHours();
  let minutes = date.getMinutes();
  console.log(hours, minutes);
  hours < 12 ? (ampm = "am") : (hours += -12); //change from 24hr to am/pm
  minutes = (minutes < 10 ? "0" : "") + minutes; //add 0 infront of minutes if 1 digit
  return `${hours}:${minutes}${ampm}`;
};

const showExtraWeather = (info, i = 0) => {
  // content after clicking more info button
  let data = info.data; // because this data is used a lot, created a variable to shorten it further
  precipitation.innerHTML = `Precipitation chance: ${data[i].pop}%`;
  humidity.innerHTML = `Humidity: ${data[i].rh}%`;
  windSpeed.innerHTML = `Wind speed: ${Math.floor(data[i].wind_spd)} knots`;
  windGustSpeed.innerHTML = `Wind gust speed: ${Math.floor(data[i].wind_gust_spd)} knots`;
  windDirection.innerHTML = `Wind direction: ${data[i].wind_cdir_full}`;
  uvIndex.innerHTML = `UV Index: ${Math.floor(data[i].uv)}`;
  timeZone.innerHTML = "Time displayed as current location time zone:";
  sunrise.innerHTML = `Sunrise: ${getTime(data[i].sunrise_ts)}`; //getTime converts from UNIx timestamp to am/pm
  sunset.innerHTML = `Sunset: ${getTime(data[i].sunset_ts)}`;
  moonrise.innerHTML = `Moonrise: ${getTime(data[i].moonrise_ts)}`;
  moonset.innerHTML = `Moonset: ${getTime(data[i].moonset_ts)}`;

  // How moon phase line works: The image is 615px wide inside a continer that is also 615px.
  // On the top of this, there is another div(moonLine) that is positioned absolute so it overlaps the image.
  // This div has a red right border that creates the line.
  // The width of the moonline div represents where we are in the moon phase cycle as a percentage.

  moonPhase.src = "moons2.png"; // image showing different phases of the moon.
  moonLine.style.borderRight = "5px solid #e01b45"; // indicator line showing current phase of the moon
  let moonWidth = Math.floor(data[i].moon_phase_lunation * 100); // translates moon phase data (0-1) to div width %
  moonLine.style.width = `${moonWidth}%`; //apply percentage width to the moonline div.
};

const showCurrentWeather = (info, i = 0) => {
  // This shows the current weather of the selected city
  let data = info.data // because this data is used a lot, created a variable to shorten it further
  city.innerHTML = info.city_name;
  currentDate.innerHTML = buildDate(data[i].datetime); // calls buildDate that returns date, day, month, year in readable format
  tempCelcius.innerHTML = `${Math.floor(data[i].temp)}°c`;
  tempFarenheit.innerHTML = `${Math.floor(data[i].temp * 1.8 + 32)}°f`; // calculating celcius to fahrenheit
  let maxTemp = Math.floor(data[i].max_temp);
  let minTemp = Math.floor(data[i].min_temp);
  maxMin.innerHTML = `Max/Min: ${maxTemp}°c/${minTemp}°c`;
  let icon = data[i].weather.icon;
  currentImage.src = `https://www.weatherbit.io/static/img/icons/${icon}.png`; // returns weather icon from the API site mapped to icon code
  description.innerHTML = data[i].weather.description;
  moreInfo.style.display = "inline-block"; // in JS as opposed to CSS to stop it displaying before submitting city
};

const showForcast = (info) => {
  let data = info.data; // because this data is used a lot, created a variable to shorten it further
  // function to show brief forcast for the next 7 days
  forcast.innerHTML = "";
  // let dayMaxC = "";
  // let dayMinC = "";
  // let dayMaxF = "";
  // let dayMinF = "";

  // let dayMinCArr = [];
  // let dayMaxCArr = [];
  // let dayMinFArr = [];
  // let dayMaxFArr = [];

  for (let i = 1; i < 8; i++) {
    //loops through next 7 days (starts at array index 1) after the current day (index 0)
    let icon = data[i].weather.icon;
    let day = document.createElement("div");
    let dayImg = document.createElement("img");
    let dayName = document.createElement("p");

    let dayMaxC = document.createElement("p");
    // dayMaxCArr.push(dayMaxC);

    // console.log("dayMaxCArr =>", dayMaxCArr);

    let dayMinC = document.createElement("p");
    // dayMinCArr.push(dayMinC);

    let dayMaxF = document.createElement("p");
    // dayMaxFArr.push(dayMaxF);

    let dayMinF = document.createElement("p");
    // dayMinFArr.push(dayMinF);

    day.appendChild(dayName);
    day.appendChild(dayImg);
    day.appendChild(dayMaxC);
    day.appendChild(dayMinC);
    day.appendChild(dayMaxF);
    day.appendChild(dayMinF);
    forcast.appendChild(day);


    dayName.innerHTML = dayOfTheWeek(data[i].datetime); // returns human readable day of the week instead of a number
    dayImg.src = `https://www.weatherbit.io/static/img/icons/${icon}.png`;

    dayMaxC.innerHTML = `Max: ${Math.floor(data[i].max_temp)}°c`;
    dayMinC.innerHTML = `Min: ${Math.floor(data[i].min_temp)}°c`;
    dayMaxF.innerHTML = `Max: ${Math.floor(data[i].max_temp * 1.8 + 32)}°f`;
    dayMinF.innerHTML = `Min: ${Math.floor(data[i].min_temp * 1.8 + 32)}°f`;

    dayMaxF.classList.add("disappear");
    dayMinF.classList.add("disappear");
    dayMaxF.classList.add("temps");
    dayMinF.classList.add("temps");
    dayMaxC.classList.add("temps");
    dayMinC.classList.add("temps");
    day.classList.add("days");
    // console.log("dayMaxCArr=> ", dayMaxCArr);

    // dayMaxCArr.push(dayMaxC);
    // dayMinCArr.push(dayMinC);
  }
};

// Main fuction that polls weatherbit API for forcast data and calls other functions.
// Takes two parameters - city name and country code.
// Returns array with 16 days of forcasts
// Key taken from keys file that is ignored by git

const populatePage = (data) => {
  errorMessage.innerHTML = ""; //resets errorMessage for next error if there is one
  showCurrentWeather(data); // shows all current day weather data   
  disappearExtraWeather(); // hides the extra info as default view when the submit button is clicked
  showForcast(data); // shows the 7 day forcast
  showExtraWeather(data); // shows extra weather info, but hidden until more info button is clicked
  changeDays(data); // listens for click on forcast days and replaces all current day weather data with that days weather data
}

const handleResponse = (res) => {
  if (!res.data.city_name) {
    errorMessage.innerHTML = "Enter valid city";    
  } else {
    let data = res.data; // because this data is used a lot, created a variable to shorten it
    populatePage(data)
  }
}

let getWeather = (location) => {
  let url = "";
  if (location) {
    url = `https://api.weatherbit.io/v2.0/forecast/daily?${location}&key=${WEATHERBIT_KEY}`;
  } else {
    url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${inputValue.value}&country=${countryCode.value}&key=${WEATHERBIT_KEY}`;
  }
  axios
  .get(url)
  .then(handleResponse)
};

const weekday = [
  //array for dayOfTheWeek function
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const dayOfTheWeek = (date) => {
  // returns human readable day instead of a number received from inbuilt getDay function
  let d = new Date(date);
  return weekday[d.getDay()];
};

const months = [
  //array for buildDate function
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const buildDate = (date) => {
  // returns human readable date in day, date, month, year format using new date JS function
  let d = new Date(date);
  let dateToday = `${weekday[d.getDay()]} ${d.getDate()} ${
    months[d.getMonth()]
  } ${d.getFullYear()}
  `;
  return dateToday;
};

moreInfo.style.display = "none"; //hides the more info button on page load before submit button is clicked

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(sendPosition, showError);
  } else {
    errorMessage.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function sendPosition(position) {
  let location = `lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
  getWeather(location);
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      errorMessage.innerHTML = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      errorMessage.innerHTML = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      errorMessage.innerHTML = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      errorMessage.innerHTML = "An unknown error occurred.";
      break;
  }
}
//EVENT LISTNERS

//This event listner invokes main function that retrieves data from the weatherbit API when submit button is clicked
document.querySelector("#get-weather").addEventListener("click", () => {
  getWeather(false);
});

//This event listner displays/hides the more info data when the more info button is clicked
document.querySelector("#more-info").addEventListener("click", () => {
  moreInfoContainer.style.display == "none" ?
    appearExtraWeather() :
    disappearExtraWeather();
});

//This event listner toggles between celcius and farenheit data when the temperature is clicked
temp.addEventListener("click", () => {
  let allTempsArr = Array.from(allTemps)
  allTempsArr.forEach((e) => {
    e.classList.toggle("disappear")
  });


  // tempFarenheit.classList.toggle("disappear");
  // tempCelcius.classList.toggle("disappear");

  // for (let i = 0; i < 7; i++) {
  //   dayMaxFArr[i].classList.toggle("disappear");
  //   dayMinFArr[i].classList.toggle("disappear");
  //   dayMaxCArr[i].classList.toggle("disappear");
  //   dayMinCArr[i].classList.toggle("disappear");
  // }
});

window.addEventListener("load", () => { // get the users latitude and longitude as default city
  getLocation();
});

const changeDays = (data) => {
  let allDaysArr = Array.from(allDays) // selects all forecast days

  function checkIndex(event) {
    // console.log(allDaysArr.indexOf(event.currentTarget));
    let i = allDaysArr.indexOf(event.currentTarget) + 1 // i becomes an integer representing the forecast day selected
    showCurrentWeather(data, i) //replaces the current day's weather with the forcast day weather
    showExtraWeather(data, i) //replaces the current day's extra weather with the forcast day extra weather
  }

  allDaysArr.forEach((day) => {
    day.addEventListener('click', checkIndex); //listens for forecast days clicked
  })
}