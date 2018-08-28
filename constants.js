/*
*  Constants
* 
*/

// Base Directory

// export const baseDir = 

// Images Directory 

export const imagesDir = 'https://s3-us-west-1.amazonaws.com/consumerland-sprites/';
// export const imagesDir = './node-utility-scripts/';

// Resolution

export const mapMaxResolution = 100;
export const mapCenter = [46000,-46000];

export const productsImageMax = 10;
export const productsCircleMax = 10;

export const brandsLabelMax = 20;
export const brandsLabelMin = 3;
export const brandsCircleMax = 50;
export const brandsCircleMin = 0;
export const brandsImageMax = 20;
export const brandsImageMin = 10;

export const subdeptsLabelMax = 1000;
export const subdeptsLabelMin = 3;
export const subdeptsCircleMax = 1000;
export const subdeptsCircleMin = 0;
export const subdeptsImageMax = 1000;
export const subdeptsImageMin = 20;

export const deptsLabelMax = 1000;
export const deptsLabelMin = 3;
export const deptsCircleMax = 1000;
export const deptsCircleMin = 0;
export const deptsImageMax = 1000;
export const deptsImageMin = 60;

// For hiding/showing category labels, images, etc. 
export const maxResolutions = [
	10,
	15,
	20,
	25,
	35,
	45,
	50,
	60,
];

export const searchResolutions = {
	dept: 29,
	subdept: productsImageMax - 0.5,
	brand: brandsLabelMin,
	product: 1
}

// Colors

export const labelColors = {
	dept: 'rgba(102,194,165, 1)',
	subdept: 'rgba(252,141,98, 1)',
	brand: 'rgba(141,160,203, 1)',
	product: 'rgba(231,138,195, 1)'
}

export const labelStyleChange = {
	dept: deptsImageMin,
	subdept: subdeptsImageMin,
	brand: brandsImageMin
}

export const labelBackgroundColors = {
	dept: 'rgba(255, 255, 255, 1)',
	subdept: 'rgba(255, 255, 255, 0.0)',
	brand: 'rgba(255, 255, 255, 0.0)',
	product: 'rgba(255, 255, 255, 0.7)'
}

export const labelStrokes = {
	dept: '#fff',
	subdept: 'rgba(255, 255, 255, 0.7)',
	brand: 'rgba(255, 255, 255, 0.7)',
	product: '#fff'
}

export const labelStrokeWidth = {
	dept: 1,
	subdept: 1,
	brand: 1,
	product: 1
}

export const circleLabelColors = {
	dept: '#303030',
	subdept: '#303030',
	brand: '#303030',
	product: '#303030'
}

export const circleColors = {
	dept: 'rgba(102,194,165, .1)',
	subdept: 'rgba(252,141,98, .1)',
	brand: 'rgba(255, 255, 255, .3)',
	product: 'rgba(255, 255, 255, 1)'
}

export const circleHoverColors = {
	dept: 'rgba(102,194,165, .2)',
	subdept: 'rgba(252,141,98, .2)',
	brand: 'rgba(255, 255, 255, .4)',
	product: 'rgba(255, 255, 255, 1)'
}

export const imageScale = {
	dept: .45,
	subdept: .3,
	brand: .18, 
	product: 1
}


// Fonts

export const fontFamily = {
	dept: 'Oswald',
	subdept: 'Oswald',
	brand: 'Oswald',
	product: 'Oswald'
}

export const fontWeight = {
	dept: '500',
	subdept: '300',
	brand: '300',
	product: '300'
}

export const fontSizesByType = {
	dept: '20',
	subdept: '16',
	brand: '14'
}

export const fontSizes = [
	10,
	12,
	14,
	16,
	18,
	18,
	20,
	22,
];
