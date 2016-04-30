var Sequelize = require('sequelize');
var Place = require(__dirname + '/placeModel.js');
var User = require(__dirname + '/../users/userModel.js');
var GOOGLE_PLACES_API_KEY = require(__dirname + '/../config/googleplaces.js');
var request = require('request');
var urlParser = require('url');
var async = require('async');
var flickr = require(__dirname +'/../flickr/flickrController.js');
var rp = require('request-promise'); //refactor into promise

var PlacesObj = function(googlePlacesData) {
  return {
    name: googlePlacesData.name,
    address: googlePlacesData['formatted_address'],
    googlePlaceId: googlePlacesData['place_id'],
    latitude: googlePlacesData['geometry']['location']['lat'],
    longitude: googlePlacesData['geometry']['location']['lng'],
    url: '',
    reviews: googlePlacesData.reviews[0],
    rating: Math.round(googlePlacesData.rating),
    numberOfReviews: googlePlacesData.reviews.length
  }
}


module.exports.saveOne = function(req, res) {
  var user = req.body.user;
  var place = req.body.place;

  User.findOne({
    where: user
  })
  .then(function(foundUser) {
    Place.findOrCreate({where: place})
      .spread(function(foundOrCreatedPlace) {
         foundUser.addPlace(foundOrCreatedPlace)
          .then(function(){
            return foundUser.getPlaces();
          })
          .then(function(foundPlace){
            console.log('foundplace', foundPlace);
            res.json(foundPlace);
          })

     });
  });
};

module.exports.deleteOne = function(req, res) {
  var userId = req.body.userId;
  var placeId = req.body.placeId;

  User.findOne({
    where: {
      id: userId
    }
  })
  .then(function(foundUser) {
    Place.destroy({
      where: {
        id: placeId
      }
    })
  });

//   Reimplement with this methodology if there's time:
//   var userFound;
//   User.findOne({
//     where: user
//   })
//   .then(function(foundUser) {
//     // console.log(JSON.stringify(foundUser) + ' < --------- FOUNDUSER');
//     userFound = foundUser;
//   });
// ​
//   Place.findOne({ 
//     where: {googlePlaceId: place.googlePlaceId} 
//   })
//   .then(function(place) {
//     // remove the association between the user and the place
//     userFound.removePlace(place).then(function() {
//       console.log('REMOVED');
//       console.log(JSON.stringify(place) + '  <-------------- PLACEFOUND');
//       res.json(place);
//     });

};


//Make a get call to Google Places radarsearch endpoint, get back 200 results;
//Make a get call to Google Places details endpoint for each of the 200 results, match their reviews against regexes, send filtered and simplified results back to client;
//Use a counter to make sure the results are only sent to client after all the initial results have been examined.

module.exports.searchGoogle = function(req, res) {

  var searchString = urlParser.parse(req.url).search; //include leading question mark

  var responseBody = {};
  responseBody.places = [];
  var cap = 10;
  var entered = 0;

  rp.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?'
      + '&location=' + '37.7836970,-122.4089660'
      + '&radius=' +  10000
      + '&keyword=' +'scenery'
      + '&key=' + GOOGLE_PLACES_API_KEY
      + '&types=' + 'park|bar|restaurant'
    )
    .then(function(body){
      var data = JSON.parse(body);                   //parse the data
      console.log('this is the refined data', data.results.length);
      if (data.results && data.results.length > 0) { //check that there is data
        return data.results;
      }
    })
    .catch(function(err){
      console.log('google places API call failure', err);
    })
    .then(function(places){
      async.map(places, function(place) {
        rp.get('https://maps.googleapis.com/maps/api/place/details/json?'
                + 'key=' + GOOGLE_PLACES_API_KEY
                + '&placeid=' + place.place_id
              )
              .then(function(locationData){
                var formattedLocation = JSON.parse(locationData).result;
                var placesObj = PlacesObj(formattedLocation);
                flickr.search(placesObj, responseBody, res)
                  .then(function(data){
                   if(data){
                    entered++;
                   }
                   if (entered === cap) {
                    res.json(responseBody);
                   } else if (entered === places.length) {
                    res.json(responseBody);
                   }
                  });
              })
        })
      // for (var i = 0; i < places.length; i++) {
      //   rp.get('https://maps.googleapis.com/maps/api/place/details/json?'
      //       + 'key=' + GOOGLE_PLACES_API_KEY
      //       + '&placeid=' + places[i].place_id
      //     )
      //     .then(function(locationData){
      //       var formattedLocation = JSON.parse(locationData).result;
      //       var placesObj = PlacesObj(formattedLocation);
      //       flickr.search(placesObj, responseBody, res)
      //         .then(function(data){
      //          if(data){
      //           entered++;
      //          }
      //          if (entered === cap) {
      //           res.json(responseBody);
      //          } else if (entered === places.length) {
      //           res.json(responseBody);
      //          }
      //         });

      //     })
      //     .catch(function(err){
      //       console.log('google places review regexxing error', err);
      //     });
      //   //} end of API call
      // }
    });
};



