var Sequelize = require('sequelize');
var Place = require(__dirname + '/placeModel.js');
var User = require(__dirname + '/../users/userModel.js');
var GOOGLE_PLACES_API_KEY = require(__dirname + '/../config/googleplaces.js');
var request = require('request');
var urlParser = require('url');
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
  }
}

module.exports.getAllSaved = function(req, res) {
  var user = req.body.user;

  User.findOne({
    where: user
  })
  .then(function(foundUser) {
    return foundUser.getPlaces();
  })
  .then(function(foundPlaces) {
    res.json(foundPlaces);
  });
};

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
      .then(function() {
        res.json(foundOrCreatedPlace);
      });
    });
  });
};

module.exports.deleteOne = function(req, res) {
  var user = req.body.user;
  var place = req.body.place;

  User.findOne({
    where: user
  })
  .then(function(foundUser) {
    // Place.findOne({
    //   where: place
    // })
    // .then(function(foundPlace) {
    //   res.json(foundPlace);
    // });
    res.json(user);

  });

  // User.findOne({
  //   where: user
  // })
  // .then(function(foundUser) {
  //   Place.findOne({where: place})
  //   .then(function(foundPlace) {
  //     // foundUser.removePlace(foundPlace)
  //     // .then(function() {
  //       res.json(foundPlace);
  //     // });
  //   });
  // });

  // Place.findOne({
  //   where: {googlePlaceId: place.googlePlaceId}
  // })
  // .then(function(place) {
  //   // remove the association between the user and the place
  //   user.removePlace(place);
  //     // TODO: For future, do a check:
  //     // if no users have a place with the same id as this one,
  //     // delete that place from the places table so that you don't end
  //     // up with lots of places that aren't associated with any users.
  //     // This will only matter if this app goes global!
  // });
};


//Make a get call to Google Places radarsearch endpoint, get back 200 results;
//Make a get call to Google Places details endpoint for each of the 200 results, match their reviews against regexes, send filtered and simplified results back to client;
//Use a counter to make sure the results are only sent to client after all the initial results have been examined.

module.exports.searchGoogle = function(req, res) {

  var searchString = urlParser.parse(req.url).search; //include leading question mark
  var regex1 = new RegExp(/(good|great|pretty|awesome|fantastic|terrific|nice|cool|wonderful|dope|beautiful|amazing|gorgeous|breathtaking|scenic|panoramic|stunning) view/);
  var regex2 = new RegExp(/(view) (is|was|has) (good|great|pretty|awesome|fantastic|terrific|nice|cool|wonderful|dope|beautiful|amazing|gorgeous|breathtaking|scenic|panoramic|stunning)/);

  var responseBody = {};
  responseBody.places = [];
  var cap = 15;
  var entered = 0;

  rp.get('https://maps.googleapis.com/maps/api/place/radarsearch/json' + searchString
      + '&key=' + GOOGLE_PLACES_API_KEY
    )
    .then(function(body){
      var data = JSON.parse(body);                   //parse the data
      if (data.results && data.results.length > 0) { //check that there is data
        return data.results;
      }
    })
    .catch(function(err){
      console.log('google places API call failure', err);
    })
    .then(function(places){
      for (var i = 0; i < places.length; i++) {
        rp.get('https://maps.googleapis.com/maps/api/place/details/json?'
            + 'key=' + GOOGLE_PLACES_API_KEY
            + '&placeid=' + places[i].place_id
          )
          .then(function(locationData){
            var formattedLocation = JSON.parse(locationData).result;
            var reviews = formattedLocation.reviews;
            if (reviews) {
              for (var j = 0; j < reviews.length; j++) {
                if (reviews[j].text.match(regex1) || reviews[j].text.match(regex2)) {
                  var placesObj = PlacesObj(formattedLocation);
                  flickr.search(placesObj, responseBody, res)
                    .then(function(data){
                     if(data){
                      entered++;
                     }
                     if (entered === cap) {
                      res.json(responseBody);
                     }
                    });
                  break; //once review matches then end the full call
                };
              };
            };
          })
          .catch(function(err){
            console.log('google places review regexxing error', err);
          });
        //} end of API call
      }
    });
};



