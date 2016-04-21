var Sequelize = require('sequelize');
var Place = require(__dirname + '/placeModel.js');
var User = require(__dirname + '/../users/userModel.js');
var GOOGLE_PLACES_API_KEY = require(__dirname + '/../config/googleplaces.js');
var request = require('request');
var urlParser = require('url');
var flickr = (__dirname +'/../flickr/flickrController.js');


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
  var regex1 = new RegExp(/(good|great|awesome|fantastic|terrific|nice|cool|wonderful|dope|beautiful|amazing|gorgeous|breathtaking|scenic|panoramic|stunning) view/);
  var regex2 = new RegExp(/view (is|was) (good|great|awesome|fantastic|terrific|nice|cool|wonderful|dope|beautiful|amazing|gorgeous|breathtaking|scenic|panoramic|stunning)/);

  request.get('https://maps.googleapis.com/maps/api/place/radarsearch/json' + searchString + '&key=' + GOOGLE_PLACES_API_KEY)
    .on('response', function(response) { //layer 1 on 'response'

      var body = [];

      response.on('data', function(chunk) { //layer 2 on 'data'
        body.push(chunk);
      }).on('end', function() { //layer 2 on 'end'
        body = JSON.parse(Buffer.concat(body).toString());
        var filteredBody = {};
        filteredBody.places = [];
        if (body.results && body.results.length > 0) {

          var places = body.results;
          var counter = 0; //ensure server only sends back filteredBody if all places have been processed
          for (var i = 0; i < places.length; i++) {
            var place = places[i];
            var placeid = place['place_id'];

            request.get('https://maps.googleapis.com/maps/api/place/details/json?' + 'key=' + GOOGLE_PLACES_API_KEY + '&placeid=' + placeid)
              .on('response', function(response) { //layer 3 on 'response'
                var body = [];
                response.on('data', function(chunk) { //layer 4 on 'data'
                  body.push(chunk);
                }).on('end', function() { //layer 4 on 'end'
                  body = JSON.parse(Buffer.concat(body).toString());
                  var placeDetails = body.result;
                  var reviews = placeDetails.reviews;
                  if (reviews) {
                    for (var j = 0; j < reviews.length; j++) {
                      var review = reviews[j];
                      if (review.text.match(regex1) || review.text.match(regex2)) { //TODO: improve regex matching

                        flickr.searchFlickr(placeDetails.name, placeDetails['geometry']['location']['lng'], placeDetails['geometry']['location']['lat'])
                          .then(function(photoID){
                            console.log("THIS IS THE ID OF THE PHOTO", photoID);
                            return flickr.getPhotoUrl(photoID);
                          })
                          .then(function(url){
                            console.log("THIS IS THE URL");
                            filteredBody.places.push({
                              name: placeDetails.name,
                              address: placeDetails['formatted_address'],
                              googlePlaceId: placeDetails['place_id'],
                              //include long/lat for flickr API
                              latitude: placeDetails['geometry']['location']['lat'],
                              longitude: placeDetails['geometry']['location']['lng'],
                              url: url,
                            });
                          });
                        break;
                      }
                    }
                  }
                  counter++;
                  if (counter === places.length) {
                    res.json(filteredBody);
                  }
                }); //end of layer 4 on 'end'
              }) //end of layer 3 on 'response'
              .on('error', function(error) { //layer 3 on 'error'
                //TODO: handle error
                counter++;
                if (counter === places.length) {
                  res.json(filteredBody);
                }
              }) //end of layer 3 on 'error'
          }

        } else {
          res.json(filteredBody);
        }
      }); //end of layer 2 on 'end'
    }) //end of layer 1 on 'response'
    .on('error', function(error) { //layeon 'error'
      //TODO: handle error
    }); //end of layer 1 on 'error'
};



