/***********************

  Load Components!
  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pug          - A view engine for dynamically rendering HTML pages
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
const { v4: uuidv4 } = require("uuid");

const express = require("express"); // Add the express framework has been added
let app = express();

const rp = require("request-promise");

const bodyParser = require("body-parser"); // Add the body-parser tool has been added
app.use(bodyParser.json()); // Add support for JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Add support for URL encoded bodies

const html = require("html"); // Add the 'pug' view engine

//Create Database Connection
const pgp = require("pg-promise")();

var path = require("path");

/**********************

  Database Connection information
  host: This defines the ip address of the server hosting our database.  We'll be using localhost and run our database on our local machine (i.e. can't be access via the Internet)
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: named weather
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database.  You'll need to set a password USING THE PSQL TERMINAL THIS IS NOT A PASSWORD FOR POSTGRES USER ACCOUNT IN LINUX!
**********************/
// REMEMBER to chage the password

const dbConfig = {
  host: "ec2-54-86-57-171.compute-1.amazonaws.com",
  port: 5432,
  database: "dc7jlst3fp1l35",
  user: "spgxlnbgalreho",
  password: "05a10587e28d292626ddcc5d8bc563cca2321eb2332c767a0fc8e057347b01be"
};

let db = pgp(dbConfig);

app.set("view engine", html);
app.use(express.static(__dirname + "/public/")); // This line is necessary for us to use relative paths and access our resources directory

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

var eldo = JSON.parse('{"name": "Eldora", "lat": "39.9372", "lng": "-105.5827"}');
var breck = JSON.parse('{"name": "Breckenridge", "lat": "39.480227", "lng": "-106.066698"}');
var vail = JSON.parse('{"name": "Vail", "lat": "39.6403", "lng": "-106.3742"}');
var beav = JSON.parse('{"name": "Beaver Creek", "lat": "39.6042", "lng": "-106.5165"}');
var steam = JSON.parse('{"name": "Steamboat Springs", "lat": "40.4850", "lng": "-106.8317"}');
var key = JSON.parse('{"name": "Keystone", "lat": "39.5792", "lng": "-105.9347"}');
var abay = JSON.parse('{"name": "Arapahoe Basin", "lat": "39.6425", "lng": "-105.8719"}');
var copp = JSON.parse('{"name": "Copper", "lat": "39.5021", "lng": "-106.1510"}');
var winter = JSON.parse('{"name": "Winter Park", "lat": "39.8917", "lng": "-105.7631"}');
var resorts = [eldo, breck, vail, beav, steam, key, abay, copp, winter];

//function to post data to postgres
function retrieveNpost(url, resort, id, url2) {
  rp.get(url)
    .then((res) => {
      let data = JSON.parse(res)[0].data[1];
      let snowpack = data["Snow Depth (in)"] ? data["Snow Depth (in)"] : null;
      let snowfall = data["Change In Snow Depth (in)"] ? data["Change In Snow Depth (in)"] : null;
      let temp = data["Observed Air Temperature (degrees farenheit)"];
      console.log("data:", data);
      rp.get(url2)
        .then((res2) => {
          let wind = JSON.parse(res2).currently.windSpeed;
          let conditions = JSON.parse(res2).currently.summary;
          let query1 =
            "CREATE TABLE IF NOT EXISTS weather( id INT PRIMARY KEY, mountain VARCHAR(30) , temperature INT,wind INT, snowpack INT, snowfall INT, conditions VARCHAR(30));";
          let query2 = `INSERT INTO weather (id, mountain, temperature, snowpack, snowfall, wind, conditions) VALUES (${id}, ${resort}, ${temp}, ${snowpack}', ${snowfall}, ${wind}, '${conditions}') ON CONFLICT (id) DO UPDATE SET temperature = ${temp}, snowpack = ${snowpack}, snowfall = ${snowfall}, wind = ${wind}, conditions = ${conditions};`;
          //console.log(query2);
          db.task("insert data", (task) => {
            return task.batch([task.any(query1), task.any(query2)]);
          })
            .then((data) => {
              return true;
            })
            .catch((error) => {
              //console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

app.get("/", (req, res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "./public/Home.html"));
});

app.get("/Home", (req, res) => {
  for (resort in resorts) {
    var url = "http://api.powderlin.es/closest_stations?lat=" + resorts[resort].lat + "&lng=" + resorts[resort].lng + "&data=true&days=1&count=1";
    var url2 = `https://api.darksky.net/forecast/0bb64cbe7d94b50e33c824e088f2c9f7/${resorts[resort].lat},${resorts[resort].lng}`;
    retrieveNpost(url, "'" + resorts[resort].name + "'", resort, url2); //single quotes added to string
  }
  let query1 =
    "CREATE TABLE IF NOT EXISTS users( user_id SERIAL PRIMARY KEY, name VARCHAR(30), email VARCHAR(30) UNIQUE, password VARCHAR(20), is18 BOOL, isDriver BOOL, car VARCHAR(50), car_color VARCHAR(20), license VARCHAR(15));";
  let query2 =
    "CREATE TABLE IF NOT EXISTS available_rides(ride_id SERIAL PRIMARY KEY,	user_id SERIAL NOT NULL,	ride_date VARCHAR(30) NOT NULL, ride_time TIME NOT NULL,	dest_mountain VARCHAR(30) NOT NULL, start_city VARCHAR(20), ride_cost SMALLINT NOT NULL, open_seats SMALLINT NOT NULL, optional_notes TEXT);";
  db.task("insert data", (task) => {
    return task.batch([task.any(query1), task.any(query2)]);
  })
    .then((data) => {
      //do nothing
    })
    .catch((error) => {
      console.log(error);
    });
  res.sendFile(path.join(__dirname, "./public", "Home.html"));
});

app.get("/search_rides", function (req, res) {
  console.log(req.query);
  var destMountain = req.inputResortDest;
  var startCity = req.inputStartCity;
  var departDate = req.departDate;
  var searchReq =
    "select * from available_rides where dest_mountain = '" + destMountain + "' and start_city = '" + startCity + "' and ride_date = '" + departDate + "';"; //Need to fill in names of tables and columns
  console.log(searchReq);
  db.task("get-everything", (task) => {
    return task.batch([task.any(searchReq)]);
  })
    .then((info) => {
      res.send(info);
    })
    .catch((error) => {
      // display error message in case an error
      console.log(err);
    });
});

app.get("/search_weather", function (req, res) {
  var weatherMountain = req.query.mountain;
  var searchReq1 = "select * from weather where mountain = '" + weatherMountain + "';";
  db.task("get-everything", (task) => {
    return task.batch([task.any(searchReq1)]);
  })
    .then((info1) => {
      res.send(info1[0]);
    })
    .catch((error) => {
      // display error message in case an error
      console.log(error);
    });
});

app.post("/add", (req, res) => {
  console.log("server" + req.body);
  var query = `INSERT INTO available_rides (user_id, ride_date, ride_time, dest_mountain, start_city, ride_cost, open_seats, optional_notes) VALUES (${req.body.user_id}, '${req.body.date}', '${req.body.date}', '${req.body.resort}', '${req.body.start}', ${req.body.pay}, ${req.body.slots}, '${req.body.description}');`;
  db.any(query)
    .then((data) => {
      console.log("inserted");
    })
    .catch((err) => {
      console.log(err);
    });
  res.sendFile(path.join(__dirname, "./public", "Settings.html"));
});

app.get("/Login", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "Login.html"));
});

app.post("/login", (req, res) => {
  console.log("server " + req.body);
  let email = req.body.email;
  let password = req.body.password;
  let query = `SELECT user_id FROM users WHERE email = '${email}' AND password = '${password}';`;
  db.any(query)
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.send("ERROR");
    });
});

app.get("/Signup", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "Signup.html"));
});

app.get("/Settings", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "Settings.html"));
});

app.post("/signup", (req, res) => {
  let query = `INSERT INTO users (user_id, name, email, password, is18, isDriver) VALUES ('${uuidv4()}', '${req.body.first} ${req.body.last}', '${
    req.body.email
  }', '${req.body.password}', ${req.body.is18}, ${req.body.isDriver})`;
  let q2 = `SELECT user_id FROM users WHERE email='${req.body.email}'`;
  console.log(q2);
  db.any(q2)
    .then((data) => {
      console.log(data[0]);
      if (data[0]) res.send("Nah");
      else {
        db.any(query)
          .then((data2) => {
            db.any(q2).then((data3) => {
              console.log(data3[0].user_id);
              res.send(data3);
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/Profile", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "Profile.html"));
  //db.any('')
});

app.get("/Faq.html", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "Faq.html"));
  //db.any('')
});

app.listen(process.env.PORT || 3000);
console.log("3000 is the magic port");
