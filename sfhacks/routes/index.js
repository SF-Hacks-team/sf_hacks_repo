var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
let encodedParser = bodyParser.urlencoded({ extended: false })
let User = require('../models/user')
//let request = require("request")
//let lineReader = require('line-reader');
//const Fs = require('fs');
//const CsvReadableStream = require('csv-reader');
const { convertCSVToArray } = require('convert-csv-to-array');
const csvtojsonV2=require("csvtojson");
const csv=require('csvtojson');
const { request, routes } = require('../app');
const fetch = require('node-fetch');
const axios = require('axios');
const { route } = require('./users');
//const csvtojsonV2=require("csvtojson/v2");

router.post('/form', encodedParser ,async (req, res, next) => {
  User.create(req.body).then(function(user){
    res.status(200).send("Succesfully submitted form data")
  });
  let county = req.body.county
  let state = req.body.state
  let fips = await getFips(county, state);
  
  var stats;

  if (fips.length < 5) {
    fips = '0' + fips
  }

  let apiKey = 'b52fc9bbd9664d32b8959729945ca6a7'
  let apiURL = `https://api.covidactnow.org/v2/county/${fips}.timeseries.json?apiKey=${apiKey}`

  fetch(apiURL)
    .then(res => res.json())
    .then(json => console.log(json.data.fips));



  // fetch(apiURL)
  //   .then(res => res.json())
  //   .then(json => stats = json)
  //   .then(() => console.log("Done"))



  //statsJSON = await axios(apiURL);
  // Make a request for a user with a given ID
// axios.get(apiURL)
// .then(function (response) {
//   // handle success
//   console.log("Start of request")
//   console.log(response.data[0]);
//   console.log("End of request")
// })
// .catch(function (error) {
//   // handle error
//   console.log(error);
// })
// .then(function () {
//   // always executed
// });
//   //console.log(statsJSON.data)
//   //queryStats = getStats(statsJSON)
  
//   res.render('statistics')
//   //res.render('statistics', {risklvl:risklvl, numCases: numCases, newCases:newCases, hospitalCap:hospitalCap})
 });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home Page' });
});

module.exports = router;


async function  getFips(county, state) {
  county = county.toLowerCase();
  state = state.toLowerCase();

  const csvFilePath='./public/csv/countycodes.csv'
  const data = await csv()
  .fromFile(csvFilePath)
  const fips = Object.values(data).find((location) =>{
    if (location.county_name.toLowerCase() == county && location.state_name.toLowerCase() == state) {
      return true
    } else {
      return false
    }
  })
    return fips.fips
}

function getStats(statsObj) {
  //res.render('statistics', {risklvl:risklvl, numCases: numCases, newCases:newCases, hospitalCap:hospitalCap})
  riskLevel = statsObj.riskLevels
  numCases = statsObj.actuals
  hospitalCap = statsObj.actuals
  newCases = statsObj.actuals

  var queryStats = {
    risklvl:riskLevel,
    numCases:numCases,
    hospitalCap:hospitalCap,
    newCases:newCases,
  }
  return queryStats;
}



