const functions = require('firebase-functions');
const express = require("express");
const app = express();
const fs = require('fs');

const featureSet = JSON.parse(fs.readFileSync(__dirname + '/allFeatureDataCollection.json','utf8'));

app.get("/api", (req, res) => {
    const type = req.query.type;
    const types = type.split(',');
    const featureReq = [];
    for (feature of featureSet.features) {
      if ( types.indexOf(feature.properties.type) > -1 ) {
          featureReq.push(feature);
      }  
    }
    res.set('Cache-Control', 'public, max-age=3000, s-maxage=6000'); 
    res.json(featureReq);
    console.log('request was: ', type);
});
app.listen(8080, () => console.log("Listening on port 8080!"));


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.app = functions.https.onRequest(app);
