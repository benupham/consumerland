const fs = require('fs')
const spritesmith = require('spritesmith')
const imagemagick = require('imagemagick')


const productsMaster = JSON.parse(fs.readFileSync('./data/productsMaster2.json','utf8'));

const productsGeoJson = {};

// excludes Sales department
createGeoJson = function (filter) {
	productsGeoJson.type = 'FeatureCollection';
	productsGeoJson.features = [];
	let i = 0;

	productsMaster.forEach((product) => {
		if (product.department != 'sales' && ((product.subdepartment == filter) || (product.department == filter) || (filter == 'all'))) {
			productsGeoJson.features[i] = { 
				"type": "Feature",
				"id": product.productName + ' ' + i,
				"properties": {
					"name": product.productName,
					"price": product.productPrice,
					"productsize": product.productSize,
					"offset": product.offset || [0, 0],
					"size": product.productImgSize || [200, 200],
					"src": product.productSpriteSrc || product.productImgPath,
					"department": product.department,
					"subdepartment": product.subdepartment
				}
			};
			i++;
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
	// console.log(columns,rows,points);

	productsGeoJson.features.forEach((feature, index) => {
		feature.geometry = {
			"type": "Point",
			"coordinates": points[index]
		}
	})
	let productsSet = JSON.stringify(productsGeoJson, null, 2);
	productsSet = 'export const productData = '+ productsSet; 
	fs.writeFile('productSet.js', productsSet, (err) => {if (err) console.log(err); });

}

createGeoJson('snacks');

