// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// searchRecent <buttons>
// forecastToday - <div> for today
// forecastFive - firstChild :5-day forecast
// forecastDays - row for the input
var apiKey = "85b2ec11dc0efbf1ecf90462e1fcb01d"
var weatherSearchHistory = JSON.parse(localStorage.getItem("weatherSearches"));
if (weatherSearchHistory === null) {
    weatherSearchHistory = {
        home: '',
        list: [],
    };
};
//load local storage weatherSearchHistory { home: "", recent: ["", ""]} / populate home dropdown

function buildWeather(weatherData) {
    $(".forecastToday").empty();

};

//buildforecast()

//updateHistory() push to recents / save to storage /itterate backwards / clear() and build buttons



const recentQueries = document.querySelectorAll('.searchBtnRecent');

recentQueries.forEach(recentSearch => {
    //Adds search function to recentSearch Buttons
    recentSearch.addEventListener('click', function () {
        getGeoLoc(this.innerHTML);
    });
});

// Event listener to Perform Query for input text
document.getElementById("searchBtnInput").addEventListener("click", () => {
    event.preventDefault();
    getGeoLoc(document.getElementsByClassName("searchInput")[0].value);
    // getWeather
});


function getForecast(lat, lon) {
    console.log(lat, lon); 
    fetch("http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    })

};

function getWeather(lat, lon) {
    console.log(lat, lon); 
    fetch("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        buildWeather(data);
    })

};

//Gets Lat & Lon from zipcode or city name and gets current weather and forecast for those coords
function getGeoLoc(city) {

    if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(city)) {
        fetch("http://api.openweathermap.org/geo/1.0/zip?zip=" + city + ",US&appid=" + apiKey)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                getWeather(data.lat, data.lon);
                getForecast(data.lat, data.lon);
            })
    } else {
        fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&limit=1&appid=" + apiKey)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                getWeather(data[0].lat, data[0].lon);

            })
    }
    



    // var data = await fetch(geoUrl);
    // var response = data.json()
    // console.log(response);

}