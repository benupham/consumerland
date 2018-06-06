/*
*  Constants
* 
*/

// Base Directory

// export const baseDir = 

// Images Directory 

export const imagesDir = 'https://s3-us-west-1.amazonaws.com/consumerland/';

// Resolution

export const productsImageMax = 7;
export const productsCircleMax = 25;

export const brandsLabelMax = 35;
export const brandsLabelMin = 0;
export const brandsCircleMax = 50;
export const brandsCircleMin = 0;
export const brandsImageMax = 25;
export const brandsImageMin = 0;

export const subdeptsLabelMax = 60;
export const subdeptsLabelMin = 0;
export const subdeptsCircleMax = 1000;
export const subdeptsCircleMin = 0;
export const subdeptsImageMax = 60;
export const subdeptsImageMin = 0;

export const deptsLabelMax = 1000;
export const deptsLabelMin = 0;
export const deptsCircleMax = 1000;
export const deptsCircleMin = 0;
export const deptsImageMax = 1000;
export const deptsImageMin = 0;

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

// Offsets

export const nameOffset = 120;
export const priceOffset = 146;

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
	subdept: '#606060',
	brand: '#808080',
	product: '#606060'
}

export const labelBackgroundColors = {
	dept: 'rgba(255, 255, 255, 0.7)',
	subdept: 'rgba(255, 255, 255, 0.7)',
	brand: 'rgba(255, 255, 255, 0.7)',
	product: 'rgba(255, 255, 255, 0.7)'
}

export const labelStrokes = {
	dept: '#fff',
	subdept: '#fff',
	brand: '#fff',
	product: '#fff'
}

export const circleLabelColors = {
	dept: '#303030',
	subdept: '#303030',
	brand: '#303030',
	product: '#303030'
}

export const circleColors = {
	dept: 'rgba(249, 198, 90, 0.3)',
	subdept: 'rgba(0, 133, 62, 0.3)',
	brand: 'rgba(255, 255, 255, 0.2)', 
	product: 'rgba(255, 255, 255, 1)'
}

export const circleHoverColors = {
	dept: 'rgba(249, 198, 90, 0.4)',
	subdept: 'rgba(0, 133, 62, 0.4)',
	brand: 'rgba(255, 255, 255, 0.4)', 
	product: '#fff'
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
	subdept: '400',
	brand: '300',
	product: '400'
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
