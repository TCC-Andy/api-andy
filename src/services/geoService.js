const MapboxClient = require('mapbox');

const client = new MapboxClient('pk.eyJ1IjoiczRsZXpcmR2IiwiYSI6ImNrN2xkNjh2YjA2amszbXB0OTN6d253NHAifQ.cqIYc0WTrpHyy13mQgjwQ');

exports.send = async (numero, rua, bairro, cidade) => {
  return client.geocodeForward(numero + " " + rua + " " + bairro + " " + cidade)
    .then(function (res) {
      const data = res.entity;
    
      return data
    })
    .catch(function (err) {
      console.log(err)
      return err

    });

}
