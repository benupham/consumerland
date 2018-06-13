var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-west-1",
    endpoint: "https://dynamodb.us-west-1.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing features into DynamoDB. Please wait.");

var allFeatures = JSON.parse(fs.readFileSync('./data/allFeatureDataCollection.json', 'utf8'));
allFeatures.features.forEach(function(feature) {
    var params = {
        TableName: "consumerland-features2",
        Item: {
            "fid":  feature.id,
            "type": feature.properties.type,
            "properties": feature.properties,
            "geometry":  feature.geometry
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add feature", feature.id, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", feature.properties.name);
       }
    });
});