const MapboxClient = require('mapbox');

const client = new MapboxClient('pk.eyJ1IjoiczRsZXphcmR2IiwiYSI6ImNrN2xkNjh2YjA2amszbXB0OTN6d253NHAifQ.cqxIYc0WTrpHyy13mQgjwQ');

client.geocodeForward('rua rio tiete 250 weissopolis Pinhais')
  .then(function(res) {
    const data = res.entity; 
    //console.log(data.features[0].center[0])
    //console.log(data.features[0].center[1])
    console.log(data.features[0].geometry.coordinates)
  })
  .catch(function(err) {
      console.log(err)
  });

