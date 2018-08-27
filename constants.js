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

export const productsImageMax = 10;
export const productsCircleMax = 10;

export const brandsLabelMax = 20;
export const brandsLabelMin = 0;
export const brandsCircleMax = 50;
export const brandsCircleMin = 0;
export const brandsImageMax = 20;
export const brandsImageMin = 10;

export const subdeptsLabelMax = 1000;
export const subdeptsLabelMin = 0;
export const subdeptsCircleMax = 1000;
export const subdeptsCircleMin = 0;
export const subdeptsImageMax = 1000;
export const subdeptsImageMin = 20;

export const deptsLabelMax = 1000;
export const deptsLabelMin = 0;
export const deptsCircleMax = 1000;
export const deptsCircleMin = 0;
export const deptsImageMax = 1000;
export const deptsImageMin = 60;

// For zooming to features from external controls
export const featureZoomRes = {
	dept: subdeptsImageMin - 1,
	subdept: brandsImageMin - 1,
	brand: 3,
	product: 1
}

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
	brand: 2,
	product: 1
}

// Colors

export const colors = [
  '#303030',
  '#606060',
  '#808080',
  '#A9A9A9',
  '#C0C0C0',
  '#DCDCDC',
  '#E8E8E8',
  '#fff'
]

export const labelColors = {
	dept: '#606060',
	subdept: '#636363',
	brand: '#606060',
	product: '#606060'
}

export const labelBackgroundColors = {
	dept: 'rgba(255, 255, 255, 0.7)',
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
	brand: 4,
	product: 1
}

export const circleLabelColors = {
	dept: '#303030',
	subdept: '#303030',
	brand: '#303030',
	product: '#303030'
}

export const circleColors = {
	dept: 'rgba(249, 198, 90, 0.15)',
	subdept: 'rgba(0, 133, 62, 0.15)',
	brand: 'rgba(255, 255, 255, 0.15)', 
	product: 'rgba(255, 255, 255, 1)'
}

export const circleHoverColors = {
	dept: 'rgba(249, 198, 90, 0.2)',
	subdept: 'rgba(0, 133, 62, 0.2)',
	brand: 'rgba(255, 255, 255, 0.3)', 
	product: '#fff'
}

export const imageScale = {
	dept: .5,
	subdept: .325,
	brand: .2, 
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
	subdept: '500',
	brand: '300',
	product: '400'
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
