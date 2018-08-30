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
export const mapStartResolution = 100;
export const mapMaxResolution = 100;
export const mapCenter = [46000,-46000];

export const productsImageMax = 10;
export const productsCircleMax = 10;
export const productsLabelMax = 4;

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
	5,
	10,
	20,
	30,
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
	product: '#808080'
}

export const labelStyleChange = {
	dept: deptsImageMin,
	subdept: subdeptsImageMin,
	brand: brandsImageMin,
	product: productsImageMax
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
	subdept: 3,
	brand: 3,
	product: 3
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
	brand: 'rgba(255, 255, 255, 1)',
	product: 'rgba(255, 255, 255, 1)'
}

export const circleHoverColors = {
	dept: 'rgba(102,194,165, .2)',
	subdept: 'rgba(252,141,98, .2)',
	brand: 'rgba(255, 255, 255, 1)',
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
	dept: 'Arial, Helvetica, sans-serif',
	subdept: 'Arial, Helvetica, sans-serif',
	brand: 'Arial, Helvetica, sans-serif',
	product: 'Arial, Helvetica, sans-serif'
}

export const fontWeight = {
	dept: '500',
	subdept: '300',
	brand: '300',
	product: '300'
}

export const productLabelFontSize = 12;

export const fontSizes = [
	11,
	12,
	13,
	14,
	15,
	17,
	17,
	18
];