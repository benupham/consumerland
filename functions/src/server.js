const express = require("express");
const app = express();
const fs = require('fs');

const port = process.env.PORT || 8080;

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// Load features
const featureSet = JSON.parse(fs.readFileSync(__dirname + '/working-feature-set.json','utf8'));
const features = featureSet.features; 
const products = features.filter(f => f.properties.type === 'product')

// Serve features
app.get("/api", (req, res) => {
    const type = req.query.type;
    const types = type.split(',');
    const featureReq = [];
    for (feature of features) {
      if ( types.indexOf(feature.properties.type) > -1 ) {
          featureReq.push(feature);
      }  
    }
    //res.set('Cache-Control', 'public, max-age=3000, s-maxage=6000'); 
    res.json(featureReq);
    console.log('request was: ', type);
});

app.get("/products", (req, res) => {
  const extent = [req.query.minx, req.query.miny, req.query.maxx, req.query.maxy];
  console.log(extent)
  const productsRes = products.filter( (p, i) => {
    const x = Math.round(p.geometry.coordinates[0])
    const y = Math.round(p.geometry.coordinates[1])

    if ( x > extent[0] && x < extent[2] && y > extent[1] && y < extent[3] ) {
      return true  
    } 
    return false 
  })
  //res.set('Cache-Control', 'public, max-age=3000, s-maxage=6000'); 
  res.json(productsRes);
  console.log('number of products: ', productsRes.length);
});

module.exports = app;

