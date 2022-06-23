//INCOMPLETE DRAFT


// Firebase authentication for db queries
var admin = require("firebase-admin");

var serviceAccount = require(__dirname + "/firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://consumerland-2bb67.firebaseio.com"
});

const db = admin.firestore();

db.getCollections().then(res => {
    for (let c of res) {
        if (c.id != 'features') {
            console.log(c.id);

        }
    }
});