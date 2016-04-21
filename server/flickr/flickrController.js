var Sequelize = require('sequelize');
var flickrImage = require(__dirname + '/../places/placeModel.js');
var User = require(__dirname + '/../users/userModel.js');
var FLICKR_API_KEY = require(__dirname + '/../config/flickr.js');
var request = require('request');
var urlParser = require('url');
var Flickr = require('flickrapi');

//Flickr.authenticate(FLICKR_API_KEY,function(error, ))

module.exports.searchFlickr = function(text, lon, lat) {
  console.log('search firing on -->', text);
  //search coordinates or string
  var queryString = text;
  var lon = lon;
  var lat = lat;
  var radius = 1;
  var accuracy = 11;
  var method ='flickr.photos.search';
  var sort = 'relevance';
  //The possible values are: date-posted-asc, date-posted-desc, date-taken-asc, date-taken-desc, interestingness-desc, interestingness-asc, and relevance.
  return request.get('https://api.flickr.com/services/rest/?method=' + method +'&text=' + queryString + '&accuracy=' + accuracy +'&lat=' + lat + '&lon=' + lon + '&radius=' + radius + '&sort=' + sort + '&api_key=' + FLICKR_API_KEY.api_key)
    .on('response', function(response) {
      var body = [];
      response.on('data', function(chunk){
        body.push(chunk);
      }).on('end', function() {
        body = Buffer.concat(body).toString();
        console.log(body);
      });
    });
};

module.exports.getPhotoUrl = function(photoID, size) {  //return image source
  request.get('https;//api.flickr.com/services/rest/?method=flickr.photos.getSizes&photo_id=' + photoID + '&api_key=' + FLICKR_API_KEY.api_key)
          .on('response', function(response) {
            var body = [];
            response.on('data', function(chunk) {
              body.push(chunk);
            }).on ('end', function() { //select the right image and return the data
              //go through the entire list
              //select the right size
              return body.something[index].source;
            })
          })
};

module.exports.search = function(text, long, lat) {
  console.log('firing');
  Flickr.authenticate(FLICKR_API_KEY, function(error, flickr) {
    if (error) {
      console.log('authentication problem', err);
      return;
    }
    console.log('authenticated yaya');
    flickr.photos.search({
      api_key: FLICKR_API_KEY.key,
      text: text,
      lon: long,
      lat: lat,
      accuracy: 11,
      radius: 1,
      sort: 'relevance',
    }, function(err, data) {
      if(err) {
        console.log('query error', err);
        return;
      }
      console.log("THE BOOM BOOM DATA", data);
      return data;
    });
  });
};
