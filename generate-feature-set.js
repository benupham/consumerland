const fs = require('fs')
const spritesmith = require('spritesmith')
const imagemagick = require('imagemagick')


const productsJson = JSON.parse(fs.readFileSync('productsMaster.json','utf8'));

const productsGeoJson = {};

// {
//     "type": "FeatureCollection",
//     "features": [
//         {
//             "type": "Feature",
//             "properties": { 
//                 "name": "Beans",
//                 "offset": [0, 0],
//                 "size": [200, 200],
//                 "src": "./images/sprites.png"
//             },
//             "geometry": {
//                 "type": "Point",
//                 "coordinates": [61.210817, 35.650072]
//             }
//         }
//     ]
// }

productsGeoJson.type = 'FeatureCollection';
productsGeoJson.features = [];
let i = 0;

productsJson.forEach((product) => {
	if (product.subdepartment == 'yogurt') {
		i++;
		let x = 200 
		productsGeoJson.features[i] = { 
			"type": "Feature",
			"properties": {
				"name": product.productName,
				"offset": product.offset || [0, 0],
				"size": product.productImgSize || [200, 200],
				"src": product.productSpriteSrc || product.productImgPath,
				"department": product.department,
				"subdepartment": product.subdepartment
			}
		};
	}
})

const featureCount = productsGeoJson.features.length;
const points = [];
const columns = Math.ceil(Math.sqrt(featureCount));
const rows = columns;
for (let k = 0; k < columns; k++) {
  for (let j = 0; j < rows; j++) {
    let x = 200 * k;
    let y = 200 * j;
    points.push([x, y]);
    
  }
}
console.log(columns,rows,points);

productsGeoJson.features.forEach((feature, index) => {
	feature.geometry = {
		"type": "Point",
		"coordinates": points[index]
	}
})

fs.writeFile('yogurt.geojson', JSON.stringify(productsGeoJson, null, 2), (err) => {console.log(err)});
