const functions = require('firebase-functions');
const express = require("express");
const app = express();
const fs = require('fs');

// Firebase authentication for db queries
// var admin = require("firebase-admin");

// var serviceAccount = require(__dirname + "/firebase-key.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://consumerland-2bb67.firebaseio.com"
// });

// const db = admin.firestore();

// Load features
const featureSet = JSON.parse(fs.readFileSync(__dirname + '/allFeatureDataCollectionSprites2.json','utf8'));
const features = featureSet.features; 

// Loads all features into collection "features" unless feature already exists
// async function loadAllFeaturesJson(features) {
//     for (let f of features) {
//         await db.collection('features').doc((f.id).toString()).get()
//         .then((snapshot) => {
//             if (!snapshot.exists) {
//                 db.collection('features').doc((f.id).toString()).set(f);
//                 console.log(f.properties.name + " successfully written!");
//             } else if (snapshot.exists) console.log(f.properties.name + ' already exists');
//         })
//         .catch((error) => {
//             console.error("Error writing document: ", error);
//         });
//     }
// }

// // Loads features into different types -- products, brands, etc. 
// async function loadFeatureTypesJson(features) {
//     for (let f of features) {
//         await db.collection(f.properties.type).doc((f.id).toString()).set(f)
//         .then(res => {
//             console.log(f.properties.name + ' added to ' + f.properties.type);
//         })
//         .catch(err => console.log(err))
//     }
// }

// // Loads categories -- dept, subdept, brand -- into their own collection 
// async function loadCategoriesJson(features) {
//     for (let f of features) {
//         if (f.properties.type != 'product') {
//             await db.collection('categoryfeatures').doc((f.id).toString()).set(f)
//             .then(res => {
//                 console.log(f.properties.name + ' added to categoryfeatures');
//             })
//             .catch(err => console.log(err))    
//         }
//     }
// }


app.get("/api", (req, res) => {
    const type = req.query.type;
    const types = type.split(',');
    const featureReq = [];
    for (feature of features) {
      if ( types.indexOf(feature.properties.type) > -1 ) {
          featureReq.push(feature);
      }  
    }
    res.set('Cache-Control', 'public, max-age=3000, s-maxage=6000'); 
    res.json(featureReq);
    console.log('request was: ', type);
});
app.listen(8080, () => console.log("Listening on port 8080!"));

exports.app = functions.https.onRequest(app);
