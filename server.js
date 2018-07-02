const express = require("express");
const app = express();
const fs = require('fs');

const featureSet = JSON.parse(fs.readFileSync('./node-utility-scripts/allFeatureDataCollectionSprites2.json','utf8'));

app.get("/api", (req, res) => {
    const type = req.query.type;
    const types = type.split(',');
    const featureReq = [];
    for (feature of featureSet.features) {
      if ( types.indexOf(feature.properties.type) > -1 ) {
          featureReq.push(feature);
      }  
    } 
    res.json(featureReq);
    console.log('request was: ', type);
});
app.listen(8080, () => console.log("Listening on port 8080!"));
