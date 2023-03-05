
var apiKey = "85b2ec11dc0efbf1ecf90462e1fcb01d"

// Checks for localStorage or builds obj
var weatherSearchHistory = JSON.parse(localStorage.getItem("weatherSearches"));
if (weatherSearchHistory === null) {
    weatherSearchHistory = {
        home: '',
        list: [],
    };
};
//load local storage weatherSearchHistory { home: "", recent: ["", ""]} / populate home dropdown

function buildRecent(city) {
    // Builds a list of recent Seach Buttons In the Sidebar
    $(".searchRecent").empty();

    for (let j = 0; j < weatherSearchHistory.list.length; j++) {
        var buttonRow = $("<div>");
        buttonRow.addClass("col-12 d-inline-flex recentItem");

        var index = $("<p>");
        index.text(j + 1).addClass("col-1");

        var recentSearch = $("<button>");
        recentSearch.addClass("searchBtn searchBtnRecent col-9")
        recentSearch.text(weatherSearchHistory.list[j]);
        if (weatherSearchHistory.list[j] === city) {
            recentSearch.css('background', "cornflowerblue");
        }


        var deleteSearch = $("<button>");
        deleteSearch.addClass("searchBtn recentBtnDelete col-1").text("X").on('click', function () {
            //* deletes the array position[j]
            //* removes button parent and rebuildResponse()
            var searchPos = $(this).siblings().first().text();
            weatherSearchHistory.list.splice((searchPos - 1), 1);
            localStorage.setItem("weatherSearches", JSON.stringify(weatherSearchHistory));
            $(this).parent().remove();
            buildRecent(city);

        });
        buttonRow.append(index);

        buttonRow.append(recentSearch);
        buttonRow.append(deleteSearch);
        $(".searchRecent").append(buttonRow);
    };

    const recentQueries = document.querySelectorAll('.searchBtnRecent');
    recentQueries.forEach(recentSearch => {
        //Adds search function to recentSearch Buttons
        recentSearch.addEventListener('click', function () {
            getGeoLoc(this.innerHTML);
        });
    });
    localStorage.setItem("weatherSearches", JSON.stringify(weatherSearchHistory));

};

function buildWeather(weatherData) {
    // Builds HTML current weather with the fetched Data
    $(".forecastToday").empty();

    var leftDiv = $("<div>");
    leftDiv.addClass(" card col");

    var rightDiv = $("<div>");
    rightDiv.addClass(" card-header col");

    var date = $("<h>");
    date.addClass("h2");
    date.text("(" + new Date(Date.now()).toLocaleString().split(',')[0] + ")")

    var icon = $("<img>");
    icon.addClass("icon");
    icon.attr('src', "https://openweathermap.org/img/wn/" + weatherData.weather[0].icon + ".png");

    var city = $("<h>");
    city.addClass("h2");
    city.text(weatherData.name);

    var feelsTemp = $("<div>");
    feelsTemp.text("Feels like: " + weatherData.main.feels_like + " F");

    var temp = $("<h>");
    temp.text("Temp: " + weatherData.main.temp + " F").addClass("h3");

    var main = $("<h>");
    main.addClass("h2 card");
    main.text(weatherData.weather[0].main);

    var otherTemp = $("<div>");
    otherTemp.text("Hi: " + weatherData.main.temp_max + " F / Lo: " + weatherData.main.temp_min + " F");

    var wind = $("<div>");
    wind.text("Wind: " + weatherData.wind.speed + " MPH")

    var clouds = $("<div>");
    clouds.text("Clouds: " + weatherData.clouds.all + " %")

    var humidity = $("<div>");
    humidity.text("Humidity: " + weatherData.main.humidity + " %");

    var desc = $("<div>");
    desc.text("Description: " + weatherData.weather[0].description);

    leftDiv.append(date);
    leftDiv.append(icon);
    leftDiv.append(city);
    leftDiv.append(temp);
    rightDiv.append(main);
    rightDiv.append(feelsTemp);
    rightDiv.append(otherTemp);
    rightDiv.append(wind);
    rightDiv.append(clouds);
    rightDiv.append(humidity);
    rightDiv.append(desc);

    $(".forecastToday").append(leftDiv);
    $(".forecastToday").append(rightDiv);



};

function buildforecast(forecastData) {
    // Builds HTML Forecast weather with the fetched Data
    var forcastArrayPosition = 4;
    $(".forecastDays").empty();
    $(".fiveDayDesc").text("5-Day Forcast:");
    for (let i = 0; i < 5; i++) {

        var weatherCard = $("<div>");
        weatherCard.addClass("card col");
        var date = $("<p>");
        dateArray = moment(forecastData.list[forcastArrayPosition].dt * 1000).format('L');
        date.addClass("card-header");
        date.text(dateArray);
        var iconLarger = $("<img>");
        iconLarger.addClass("iconLarger");
        iconLarger.attr('src', "https://openweathermap.org/img/wn/" + forecastData.list[forcastArrayPosition].weather[0].icon + ".png");
        var temp = $("<div>");
        temp.text("Temp: " + forecastData.list[forcastArrayPosition].main.temp + " F");
        var wind = $("<div>");
        wind.text("Wind: " + forecastData.list[forcastArrayPosition].wind.speed + " MPH");
        var humidity = $("<div>");
        humidity.text("Humidity: " + forecastData.list[forcastArrayPosition].main.humidity + " %")


        weatherCard.append(date);
        weatherCard.append(iconLarger);
        weatherCard.append(temp);
        weatherCard.append(wind);
        weatherCard.append(humidity);
        $(".forecastDays").append(weatherCard);
        forcastArrayPosition += 8;

    };

};

// Event listener to Perform Query for input text
document.getElementById("searchBtnInput").addEventListener("click", () => {
    event.preventDefault();
    getGeoLoc(document.getElementsByClassName("searchInput")[0].value);

});

// Fetches the weather api then calls buildForecast()
function getForecast(lat, lon) {
    console.log(lat, lon);
    fetch("http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            buildforecast(data);
        })

};

// Fetches the weather api then calls buildWeather()
function getWeather(lat, lon) {
    console.log(lat, lon);
    fetch("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
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
                if (!weatherSearchHistory.list.includes(city) && data.lat) {
                    weatherSearchHistory.list.push(city)
                };
                buildRecent(city);
                getWeather(data.lat, data.lon);
                getForecast(data.lat, data.lon);
            })
    } else {
        fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&limit=1&appid=" + apiKey)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (!weatherSearchHistory.list.includes(city) && data[0].lat && city != "Springfild") {
                    weatherSearchHistory.list.push(city)
                };
                buildRecent(city);
                getWeather(data[0].lat, data[0].lon);
                getForecast(data[0].lat, data[0].lon);
            })
    }
}

if (weatherSearchHistory.list[0]) {
    getGeoLoc(weatherSearchHistory.list[0]);

} else {
    getGeoLoc("Springfild");
}