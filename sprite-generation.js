const fs = require('fs')
const spritesmith = require('spritesmith')
const imagemagick = require('imagemagick')


const productJson = JSON.parse(fs.readFileSync('productInfo.json','utf8'));

const productsOnlyJson2 = JSON.parse(fs.readFileSync('productsOnlyJson2.json','utf8'));


let sprites = [];

// productsOnlyJson.forEach((product, index) => {
// 	if (index < 200) {
// 		sprites.push(product.productImgPath);
// 	}
// });

function generateSprites() {
	
}
spritesmith.run({src: sprites}, function handleResult (err, result) {
  fs.writeFileSync('test5.png',result.image); // Buffer representation of image
  result.coordinates; // Object mapping filename to {x, y, width, height} of image
  result.properties; // Object with metadata about spritesheet {width, height}
  //console.dir(result.coordinates,result.properties);
});

const productIndex = {};

productIndex.departmentsCount = productJson.length;

productIndex.departments = [];

productJson.forEach((dept, dindex) => {

})
fs.writeFileSync(JSON.stringify('productIndex.json'), productIndex); 




// addDepartmentstoJson() {
// 	productsOnlyJson.forEach((product) => {
// 		let pathArray = product.productImgPath.split('/');
// 		product.department = pathArray[1];
// 		product.subdepartment = pathArray[2];
// 	})

// 	fs.writeFile('productsOnlyJson2.json', JSON.stringify(productsOnlyJson, null, 2)); 	
// }

// function countProductsbyDepartment() {
// 	let countDepartments = {};
// 	let countSubdepartments = {}
// 	productsOnlyJson2.forEach((product, index) => {
// 		let department = product.department;
// 		let subdepartment = product.subdepartment;
// 		if (!countDepartments.hasOwnProperty(department)) {
// 			countDepartments[department] = 1;
// 		} else {
// 			countDepartments[department]++;
// 		}
// 		if (!countSubdepartments.hasOwnProperty(subdepartment)) {
// 			countSubdepartments[subdepartment] = 1;
// 		} else {
// 			countSubdepartments[subdepartment]++;
// 		} 
		
// 	})
// 	console.log(`departments: ${countDepartments} \n subdepartments: ${countSubdepartments}`);
// 	console.dir(countDepartments);
// 	console.dir(countSubdepartments);
// }
// countProductsbyDepartment();