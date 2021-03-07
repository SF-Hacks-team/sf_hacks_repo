var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
let encodedParser = bodyParser.urlencoded({ extended: false })
let User = require('../models/user')
let request2 = require('request');
var riskLevel;
var numCases; 
var hospitalCap;
var  newCases;
var countyName;
var firstName;
var email;
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
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { v4: uuidv4 } = require('uuid');
//const csvtojsonV2=require("csvtojson/v2");

router.post('/form', encodedParser ,async (req, res, next) => {
  //User.create(req.body).then(function(user){
    //res.status(200).send("Succesfully submitted form data")
    console.log("Step 1")
  //});
  let county = req.body.county
  countyName = county;
  let state = req.body.state
  firstName = req.body.firstName
  let fips = await getFips(county, state);
  email = req.body.email
  if (fips.length < 5) {
    fips = '0' + fips
  }

  let apiKey = 'b52fc9bbd9664d32b8959729945ca6a7'
  let apiURL = `https://api.covidactnow.org/v2/county/${fips}.timeseries.json?apiKey=${apiKey}`

 
request2(apiURL, function(error, response, body) {
  console.log("Step 3")
    if (!error && response.statusCode == 200) {
        let jsonStuff = JSON.parse(body);
        let queryStats = getStats(jsonStuff);
        console.log(queryStats)
    }
    console.log("Step 5")
        return res.redirect('/statistics')

});

 router.get('/statistics', function(req, res, next) {
   console.log("Step 6")
      sendNotification();
      res.render('statistics', { risklevel: riskLevel, numcases: numCases, hospitalcap: hospitalCap, newcases: newCases, countyname:countyName });
    });
  
 });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home Page' });
});




module.exports = router;


async function  getFips(county, state) {
  console.log("Step 2")
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
  console.log("Step 4")
  //res.render('statistics', {risklvl:risklvl, numCases: numCases, newCases:newCases, hospitalCap:hospitalCap})
  riskLevel = statsObj.riskLevels.overall
  numCases = statsObj.actuals.cases
  hospitalCap = statsObj.actuals.hospitalBeds.capacity
  newCases = statsObj.actuals.newCases

  var queryStats = {
    risklvl:riskLevel,
    numCases:numCases,
    hospitalCap:hospitalCap,
    newCases:newCases,
  }
  return queryStats;
}

function sendNotification() {
  unique_id = uuidv4();
  let request = new XMLHttpRequest()
request.onreadystatechange = function() {
  if (this.readyState === 4) {
    console.log(this.status)
    console.log(this.responseText)
  }
}
request.open("POST", "https://events-api.notivize.com/applications/4ae11472-ac21-4226-aef4-c5eb85103159/event_flows/2bb124cc-ea70-4551-b417-d9b6a06a9219/events", true)
request.setRequestHeader("Content-Type", "application/json")
request.send(JSON.stringify({
  'email': email,
  'countyName': countyName,
  'firstName': firstName,
  'newCases': newCases,
  'num_cases': 100,
  'unique_id': unique_id
}))
}