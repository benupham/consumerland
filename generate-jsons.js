const fs = require('fs');

//const createJsons = function () {
/*

	get scrape data json 
	remove unusual characters (done)
	add depts, subdepts from img path
	change image path to missing-item.jpg if url has "missing-item"
	
	generate brands and attach to products
		first word in product name, except if 
			first word is "the", then is first 2 
			product is in produce, meat&seafood, bakery, fresh food
				if first word is "organic" or "fresh", use 2nd word

	place brands inside subdepts 
	place products inside brands

	generate unique id for all depts, subdepts, brands, products 
		including duplicate Sale/Coupon items

	convert master to D3 readable json for pack()
		or not? do convert in D3 to retain structure and export easier with x,y? 

	create flat list of all features, including products, brands, subdepts, depts
		add "kind" attribute to distinguish
	create flat list of products only
	create array of uid/name pairs for all features


SAMPLE++++++++
[
  {
    "departmentName": "Sales",
    "departmentUrl": "https://www.instacart.com/store/whole-foods/departments/1000003",
    "subdepartments": [
      {
        "subdepartmentName": "Produce",
        "subdepartmentUrl": "https://www.instacart.com/store/whole-foods/departments/1000003/aisles/1000082",
        "products": [
          {
            "productName": "Organic Broccoli",
            "productPrice": "$3.34 each Reg: $4.68",
            "productSize": "At $2.49/lb",
            "productImgUrl": "https://d2d8wwwkmhfcva.cloudfront.net/200x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_c6804ed1-6cdc-42c5-a201-b7f0973fa99e.jpg",
            "productImgPath": "product-images/sales/produce/organic-broccoli-200x.jpg",
            "productBigImgPath": "product-images/sales/produce/organic-broccoli-500x.jpg",
            "productBigImgUrl": "https://d2d8wwwkmhfcva.cloudfront.net/500x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_c6804ed1-6cdc-42c5-a201-b7f0973fa99e.jpg"
          }

		Problem names:
		Organic Valley
		365
		Cuties
		Local
		Green (grapes)
		Whole Foods
		Whole Foods Market
		Fresh
		Earthbound
		Fresh Kitchen
		365 by Whole Foods Market
		Taylor Farms
		Kenner Canyon
		Produce


		

	*/



//}

const source = JSON.parse(fs.readFileSync('./data/scrape-data-working.json','utf8'));

const fruitsVegs = JSON.parse(fs.readFileSync('./data/fruits-vegs.json','utf8'));

const tagsList = [
	"local",
	"ground",
	"organic",
	"farm raised",
	"free range",
	"low sodium",
	"low fat",
	"vegan",
	"vegetarian",
	"wild caught",
	"fair trade",
	"cage free",
	"non gmo",
	"non-gmo",
	"dairy free",
	"dairy-free",
	"pasture-raised",
	"gluten free",
	"gluten-free"
];

const meatArray =  [
	'meat-counter',
	'poultry-counter',
	'seafood-counter',
	'packaged-meat',
	'packaged-poultry',
	'packaged-seafood'
];

const problemWords = [
	"organic",
	"the",
]


function addDeptsSubdepts(parsedJson) {

	parsedJson.forEach((dept) => {
		dept.subdepartments.forEach((subdept) => {
			subdept.products.forEach((product) => {
				
				let pathArray = product.productImgPath.split('/');
				product.department = pathArray[1];
				product.subdepartment = pathArray[2];

				if (product.productImgUrl.indexOf('missing-item') > -1) {
					product.productImgPath = 'product-images/missing-item.jpg';
					product.productBigImgPath = 'product-images/missing-item.jpg';
				}
			})
		})
	})
}

function createBrandsandTags(product) {

	let pName = product.productName.toLowerCase();
	let pNameArray = pName.split(" "); 
	
	// "Brand" is also type for vegetables, fruit and certain meat/seafood (for now)
	const brands = [];
	const tags = [];

	if ((product.department == 'produce') || 
			(product.department == 'sales' && product.subdepartment == 'produce')) {

		// if any string in product name matches array of produce, put in that brand
		for (let produceType in fruitsVegs[0]) {
			if (pName.indexOf(produceType) > -1) {
				product.brand = fruitsVegs[0][produceType];
				break
			} 
		};
	} else if ((meatArray.indexOf(product.subdepartment) > -1) ||
						 (product.department == 'sales' && product.subdepartment == 'meat-seafood')) {
	
		// if any string in product name matches array of meats/seafood, put in that brand
		for (let meatType in fruitsVegs[1]) {
			if (pName.indexOf(meatType) > -1) {
				product.brand = fruitsVegs[1][meatType];
				break
			} 
		};		
	
	}

	if (!product.brand) {
		
		// trim problem words from front
		if (pName.indexOf('whole foods') == 0) {
			product.brand = 'whole foods market';
		} else {
			product.brand = ['organic','the'].indexOf(pNameArray[0]) > -1 ? 
				pNameArray[0] + " " + pNameArray[1] : pNameArray[0];
		}
	}

	if (!product.tags) {
		// create productTags array	
		product.tags = [];
	}

	tagsList.forEach((tag) => {
		if (pName.indexOf(tag) > -1 && product.tags.indexOf(tag) < 0) {
			product.tags.push(tag);
		}
	})	
	return product;
}


function addBrandsTags(parsedJson) {
	parsedJson.forEach((dept) => {
		dept.subdepartments.forEach((subdept) => {
			subdept.products.forEach((product) => {
				createBrandsandTags(product);
			})
		})
	})
}






// function addBrandHierachy() {

// }

// function generateUids() {

// }

// function createFeaturesList() {

// }

// function createFlatProductsList() {

// }

// function createFeatureUidNameIndex() {

// }

function saveJson(filename, json) {
	fs.writeFile(filename, JSON.stringify(json, null, 2), (err) => {
	    if(err) throw(err);
	  }
	); 
}
