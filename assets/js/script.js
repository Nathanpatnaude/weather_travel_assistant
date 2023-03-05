
var apey = "85b2ec11dc0efbf1ecf90462e1fcb01d"

// Checks for localStorage or builds obj
var weatherSearchHistory = JSON.parse(localStorage.getItem("weatherSearches"));
if (weatherSearchHistory === null) {
    weatherSearchHistory = {
        home: 'Home Location',
        list: [],
        units: ['imperial', '°F'],
        last: "Springfild"

    };
} else {
    // Selects the last used weather Unit type
    var optionSel = weatherSearchHistory.units[0].concat(" ", weatherSearchHistory.units[1]);
    $(`.unitSelect option[value="${optionSel}"]`).attr('selected', 'selected');
};


// Allows Unit select to use F or C, updates on change
document.querySelector('.unitSelect').addEventListener('change', function () {
    weatherSearchHistory.units = document.querySelector('.unitSelect').value.split(" ");
    console.log(weatherSearchHistory.units);
    localStorage.setItem("weatherSearches", JSON.stringify(weatherSearchHistory));
    getGeoLoc(weatherSearchHistory.last);

});

//Allows home Select to use any preciously searched location, updates on Change
document.querySelector('.homeSelect').addEventListener('change', function () {
    weatherSearchHistory.home = document.querySelector('.homeSelect').value;
    localStorage.setItem("weatherSearches", JSON.stringify(weatherSearchHistory));
    if (weatherSearchHistory.home != weatherSearchHistory.last) {
        getGeoLoc(weatherSearchHistory.home);
    } else {
        buildRecent(weatherSearchHistory.home);
    }

})

function buildRecent(city) {
    // Builds a list of recent Seach Buttons In the Sidebar
    $(".searchRecent").empty();

    $(".homeSelect").empty();
    $('.homeSelect').append(`<option value="${weatherSearchHistory.home}" selected="selected">🏠${weatherSearchHistory.home}</option>`);

    for (let j = 0; j < weatherSearchHistory.list.length; j++) {
        $('.homeSelect').append(`<option value="${weatherSearchHistory.list[j]}" >${weatherSearchHistory.list[j]}</option>`);
        var buttonRow = $("<div>");
        buttonRow.addClass("col-12 d-inline-flex recentItem");

        var index = $("<p>");
        index.text(j + 1).addClass("invisible");

        var recentSearch = $("<button>");
        recentSearch.addClass("searchBtn searchBtnRecent col-10")
        recentSearch.text(weatherSearchHistory.list[j]);
        if (weatherSearchHistory.list[j] === city) {
            recentSearch.css('background', "cornflowerblue");
        }


        var deleteSearch = $("<button>");
        deleteSearch.addClass("searchBtn recentBtnDelete fa fa-trash").on('click', function () {
            //* deletes the array position[j]
            //* removes button parent and rebuildResponse()
            //* if recent search was also the home location, home location is reset
            if ($(this).siblings('.searchBtnRecent').text() === weatherSearchHistory.home) {
                weatherSearchHistory.home = 'Home Location';

            } else if ($(this).siblings('.searchBtnRecent').text() === weatherSearchHistory.last) {
                if (weatherSearchHistory.home = 'Home Location') {
                    weatherSearchHistory.last = 'Springfild';
                    getGeoLoc(weatherSearchHistory.last);
                } else {
                    getGeoLoc(weatherSearchHistory.home);
                }

            };
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
    feelsTemp.text("Feels like: " + weatherData.main.feels_like + weatherSearchHistory.units[1]);

    var temp = $("<h>");
    temp.text("Temp: " + weatherData.main.temp + weatherSearchHistory.units[1]).addClass("h3");

    var main = $("<h>");
    main.addClass("h2 card");
    main.text(weatherData.weather[0].main);

    var otherTemp = $("<div>");
    otherTemp.text("Hi: " + weatherData.main.temp_max + weatherSearchHistory.units[1] + " / Lo: " + weatherData.main.temp_min + weatherSearchHistory.units[1]);

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
    $(".forecastDays").empty();
    $(".fiveDayDesc").text("5-Day Forcast:");
    for (let i = 0; i < forecastData.list.length; i++) {
        var arrayTime = forecastData.list[i].dt_txt.split(" ");

        if (arrayTime[1] === "12:00:00") {
            var weatherCard = $("<div>");
            weatherCard.addClass("card col");
            var date = $("<p>");
            dateArray = moment(forecastData.list[i].dt * 1000).format('MM/DD/YY');
            date.addClass("card-header");
            date.text(dateArray);
            var iconLarger = $("<img>");
            iconLarger.addClass("iconLarger");
            iconLarger.attr('src', "https://openweathermap.org/img/wn/" + forecastData.list[i].weather[0].icon + ".png");
            var temp = $("<div>");
            temp.text("Temp: " + forecastData.list[i].main.temp + weatherSearchHistory.units[1]);
            var wind = $("<div>");
            wind.text("Wind: " + forecastData.list[i].wind.speed + " MPH");
            var humidity = $("<div>");
            humidity.text("Humidity: " + forecastData.list[i].main.humidity + " %")


            weatherCard.append(date);
            weatherCard.append(iconLarger);
            weatherCard.append(temp);
            weatherCard.append(wind);
            weatherCard.append(humidity);
            $(".forecastDays").append(weatherCard);

        }

    };

};

// Event listener to Perform Query for input text
document.getElementById("searchBtnInput").addEventListener("click", () => {
    event.preventDefault();
    getGeoLoc(document.getElementsByClassName("searchInput")[0].value);
    document.getElementsByClassName("searchInput")[0].value = "";

});

// Fetches the weather api then calls buildForecast()
function getForecast(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apey + "&units=" + weatherSearchHistory.units[0])
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            buildforecast(data);
        })

};

// Fetches the weather api then calls buildWeather()
function getWeather(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apey + "&units=" + weatherSearchHistory.units[0])
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            buildWeather(data);
        })

};

//Gets Lat & Lon from zipcode or city name and gets current weather and forecast for those coords
function getGeoLoc(city) {
    if (city != "") {
        weatherSearchHistory.last = city;
        if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(city)) {
            fetch("https://api.openweathermap.org/geo/1.0/zip?zip=" + city + ",US&appid=" + apey)
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
            fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&limit=1&appid=" + apey)
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
}

// On page load search home or last query
if (weatherSearchHistory.home != 'Home Location') {
    getGeoLoc(weatherSearchHistory.home);
} else {
    getGeoLoc(weatherSearchHistory.last);
}