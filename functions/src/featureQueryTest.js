// Firebase authentication for db queries
var admin = require("firebase-admin")

var serviceAccount = require(__dirname + "/firebase-key.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://consumerland-2bb67.firebaseio.com"
})

const db = admin.firestore()

const features = db.collection("features")
const query = features
  .where("properties.name", "==", "Sales")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data())
    })
  })
  .catch((err) => console.log(err))
