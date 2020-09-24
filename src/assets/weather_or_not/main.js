
// imports personal key from file - key.js for use in axios to get data from weatherbit API 
import {
  WEATHERBIT_KEY
} from "./keys.js";

// selecting all elements
const inputValue = document.querySelector(".inputValue");
const countryCode = document.querySelector(".countryCode");
const outputData = document.querySelector(".output-data");
const city = document.getElementById("city");
const currentImage = document.getElementById("current-image");
const temp = document.querySelector(".temp");
const tempCelcius = document.getElementById("tempCelcius");
const tempFarenheit = document.getElementById("tempFarenheit");
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

const disappearExtraWeather = () => {  // toggle hiding extra weather info and change button text
  console.log("in hide");
  moreInfoContainer.style.display = "none";
  moreInfo.textContent = "More Info";
};

const appearExtraWeather = () => {  // toggle hiding extra weather info and change button text
  console.log("in show");
  moreInfoContainer.style.display = "block";
  moreInfo.textContent = "Less Info";
};

const getTime = (ts) => {  // function takes UNIX timestamp and returns am/pm time
  let date = new Date(ts * 1000);  // x1000 due to JS requiring miliseconds
  let ampm = "pm";                  // default set to pm
  let hours = date.getHours();
  let minutes = date.getMinutes();
  console.log(hours, minutes);
  hours < 12 ? (ampm = "am") : (hours += -12); //change from 24hr to am/pm
  minutes = (minutes < 10 ? "0" : "") + minutes; //add 0 infront of minutes if 1 digit
  return `${hours}:${minutes}${ampm}`;
};

const showExtraWeather = (data) => {  // content after clicking more info button
  precipitation.innerHTML = `Precipitation chance: ${data[0].pop}%`;
  humidity.innerHTML = `Humidity: ${data[0].rh}%`;
  windSpeed.innerHTML = `Wind speed: ${Math.floor(data[0].wind_spd)} knots`;
  windGustSpeed.innerHTML = `Wind gust speed: ${Math.floor(
    data[0].wind_gust_spd
  )} knots`;
  windDirection.innerHTML = `Wind direction: ${data[0].wind_cdir_full}`;
  uvIndex.innerHTML = `UV Index: ${Math.floor(data[0].uv)}`;
  timeZone.innerHTML = "Time displayed as current location time zone:";
  sunrise.innerHTML = `Sunrise: ${getTime(data[0].sunrise_ts)}`;  //getTime converts from UNIX timestamp to am/pm
  sunset.innerHTML = `Sunset: ${getTime(data[0].sunset_ts)}`;
  moonrise.innerHTML = `Moonrise: ${getTime(data[0].moonrise_ts)}`;
  moonset.innerHTML = `Moonset: ${getTime(data[0].moonset_ts)}`;

  // How moon phase line works: The image is 615px wide inside a continer that is also 615px.
  // On the top of this, there is another div(moonLine) that is positioned absolute so it overlaps the image.
  // This div has a red right border that creates the line.
  // The width of the moonline div represents where we are in the moon phase cycle as a percentage.

  moonPhase.src = "moonphases/moons2.png";       // image showing different phases of the moon. 
  moonLine.style.borderRight = "5px solid #e01b45"; // indicator line showing current phase of the moon
  let moonWidth = Math.floor(data[0].moon_phase_lunation * 100);  // translates moon phase data (0-1) to div width %
  moonLine.style.width = `${moonWidth}%`; //apply percentage width to the moonline div. 
};

const showCurrentWeather = (response) => { // This shows the current weather of the selected city
  let data = response.data.data;
  city.innerHTML = response.data.city_name;
  currentDate.innerHTML = buildDate(data[0].datetime); // calls buildDate that returns date, day, month, year in readable format
  tempCelcius.innerHTML = `${Math.floor(data[0].temp)}°c`;
  tempFarenheit.innerHTML = `${Math.floor(data[0].temp * 1.8 + 32)}°f`; // calculating celcius to fahrenheit
  let maxTemp = Math.floor(data[0].max_temp);
  let minTemp = Math.floor(data[0].min_temp);
  maxMin.innerHTML = `Max/Min: ${maxTemp}°c/${minTemp}°c`;
  let icon = data[0].weather.icon;
  currentImage.src = `https://www.weatherbit.io/static/img/icons/${icon}.png`; // returns weather icon from the API site mapped to icon code
  description.innerHTML = data[0].weather.description;
  moreInfo.style.display = "inline-block";   // in JS as opposed to CSS to stop it displaying before submitting city
};

const showForcast = (data) => {  // function to show brief forcast for the next 7 days
  forcast.innerHTML = "";
  for (let i = 1; i < 8; i++) {  //loops through next 7 days (starts at array index 1) after the current day (index 0) 
    let icon = data[i].weather.icon;
    let day = document.createElement("div");
    let dayImg = document.createElement("img");
    let dayName = document.createElement("p");
    let dayMax = document.createElement("p");
    let dayMin = document.createElement("p");

    day.appendChild(dayName);
    day.appendChild(dayImg);
    day.appendChild(dayMax);
    day.appendChild(dayMin);
    forcast.appendChild(day);

    dayName.innerHTML = dayOfTheWeek(data[i].datetime);  // returns human readable day of the week instead of a number
    dayImg.src = `https://www.weatherbit.io/static/img/icons/${icon}.png`;
    dayMax.innerHTML = `Max: ${Math.floor(data[i].max_temp)}°c`;
    dayMin.innerHTML = `Min: ${Math.floor(data[i].min_temp)}°c`;
  }
};

// Main fuction that polls weatherbit API for forcast data and calls other functions.
// Takes two parameters - city name and country code.
// Returns array with 16 days of forcasts
// Key taken from keys file that is ignored by git

let getWeather = () => { 
  axios
    .get(
      `https://api.weatherbit.io/v2.0/forecast/daily?city=${inputValue.value}&country=${countryCode.value}&key=${WEATHERBIT_KEY}`
    )
    .then((response) => {
      console.log(response);
      if (!response.data.city_name) {
        throw new Error("Enter valid city");
      }
      showCurrentWeather(response);   // shows all current day weather data
      let data = response.data.data;  // because this data is used a lot, created a variable to shorten it
      disappearExtraWeather();        // hides the extra info as default view when the submit button is clicked
      showForcast(data);              // shows the 7 day forcast
      showExtraWeather(data);         // shows extra weather info, but hidden until more info button is clicked
    })
    .catch((err) => alert(err.message)); // error handling
};

const weekday = [ //array for dayOfTheWeek function
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const dayOfTheWeek = (date) => { // returns human readable day instead of a number received from inbuilt getDay function
  let d = new Date(date);
  return weekday[d.getDay()];
};

const months = [ //array for buildDate function
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

const buildDate = (date) => { // returns human readable date in day, date, month, year format using new date JS function
  let d = new Date(date);
  let dateToday = `${weekday[d.getDay()]} ${d.getDate()} ${
    months[d.getMonth()]
  } ${d.getFullYear()}
  `;
  return dateToday;
};

moreInfo.style.display = "none";  //hides the more info button on page load before submit button is clicked

//EVENT LISTNERS

//This event listner invokes main function that retrieves data from the weatherbit API when submit button is clicked
document.querySelector("#get-weather").addEventListener("click", getWeather);  

//This event listner displays/hides the more info data when the more info button is clicked
document.querySelector("#more-info").addEventListener("click", () => {
  moreInfoContainer.style.display == "none"
    ? appearExtraWeather()
    : disappearExtraWeather();
});

//This event listner toggles between celcius and farenheit data when the temperature is clicked
temp.addEventListener("click", () => {
  tempFarenheit.classList.toggle("disappear");
  tempCelcius.classList.toggle("disappear");
});
