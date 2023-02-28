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
// forcastToday - <div> for today
// forcastFive - firstChild :5-day forecast
// forcastDays - row for the input
var apiKey = "85b2ec11dc0efbf1ecf90462e1fcb01d"

document.getElementById("searchBtnInput").addEventListener("click", () => {
    event.preventDefault();
    getGeoLoc(document.getElementsByClassName("searchInput")[0].value);
    // getWeather
});

function getWeather(lat, lon) {
    console.log(lat, lon); 

};

function getGeoLoc(city) {

    if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(city)) {
        fetch("http://api.openweathermap.org/data/2.5/forecast?zip=" + city + ",US&appid=" + apiKey)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                getWeather(data.city.coord.lat, data.city.coord.lon);
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