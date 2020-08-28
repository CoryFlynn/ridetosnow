function getWeather() {
  let m = document.getElementById("inputWeatherResort").value;
  $.ajax({
    url: `https://ski-lift-site.herokuapp.com/search_weather`,
    method: "GET",
    data: {
      mountain: m
    },
    success: function (data) {
      const st = `Resort: ${data[0].mountain}, Conditions: ${data[0].conditions}, Snowpack: ${
        data[0].snowpack ? data[0].snowpack : 0
      } in. , Snow over last 24: ${data[0].snowfall ? data[0].snowfall : 0} in. , Temperature: ${data[0].temperature}°F, Wind: ${data[0].wind}mph`;
      document.getElementById("weather").innerHTML = st;
      console.log(st);
    }
  });
}

function submitForm () {
  $.ajax({
    url: "/search_rides",
    method: "GET",
    data: {
      inputResortDest: inputResortDest.value,
      inputStartCity: inputStartCity.value,
      departDate: dateInput.value
    },
    success: info => {
      console.log(info);
      document.getElementById("rideTable").innerHTML =
        "<tr><th>Ride Date</th><th>Departure Time</th><th>Starting Location</th><th>Destination Mountain</th><th>Available Seats</th><th>Additional Info</th></tr><tr><td>" +
        info[0].ride_date +
        "</td><td>" +
        info[0].ride_time +
        "</td><td>" +
        info[0].start_city +
        "</td><td>" +
        info[0].dest_mountain +
        "</td><td>" +
        info[0].open_seats +
        "</td><td>" +
        info[0].optional_notes +
        "</td></tr><tr><td>" +
        info[1].ride_date +
        "</td><td>" +
        info[1].ride_time +
        "</td><td>" +
        info[1].start_city +
        "</td><td>" +
        info[1].dest_mountain +
        "</td><td>" +
        info[1].open_seats +
        "</td><td>" +
        info[1].optional_notes +
        "</td></tr>";
    }
  });
});