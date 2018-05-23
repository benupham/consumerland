import Feature from 'ol/feature';
import Point from 'ol/geom/point';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Circle from 'ol/geom/circle';
import Stroke from 'ol/style/stroke';
import Icon from 'ol/style/icon';
import Fill from 'ol/style/fill';
import Text from 'ol/style/text';
import Style from 'ol/style/style';

import {productData} from '../data/productData.js';
import {departmentsData} from '../data/departmentsData.js';
import {subdepartmentsData} from '../data/subdepartmentsData.js';
import {brandsData} from '../data/brandsData.js';
import {
  // productsImageMax, 
  // deptsTextMin, 
  // subdeptsTextMax, 
  // subdeptsFillMax, 
  // subdeptsTextMin, 
  // brandsTextMax, 
  // brandsFillMax,
  // sqrt2, 
  // nameOffset, 
  // priceOffset,
  colors,
  labelColors,
  circleColors
} from '../constants.js';
import {textFormatter, dataTool} from '../utilities.js';


const radiusSorter = function(f) {
  let maxRes = 0;
  let fontSize = '10px sans-serif';
  const ranges = [200,400,800,1400,4310,6400];
  let v = f.properties.type == 'dept' ? f.properties.radius + 5000 
    : f.properties.type == 'subdept' ? f.properties.radius + 2000 
    : f.properties.radius;
  for (let i = 0; i < ranges.length; i++) {
    if (ranges[i] >= v) {
      v = ranges[i];
      break;
    } 
  }
  // If radius is equal to or less than the cases below
  switch(v) {
    case 200:
      maxRes = 5;
      fontSize = '12px sans-serif';
      break;
    case 400:
      maxRes = 10;
      fontSize = '12px sans-serif';
      break;
    case 800:
      maxRes = 20;
      fontSize = '14px sans-serif';
      break;
    case 1400:
      maxRes = 25;
      fontSize = '14px sans-serif';
      break;
    case 4310:
      maxRes = 55;
      fontSize = '16px sans-serif';
      break;
    case 6400:
      maxRes = 90;
      fontSize = '18px sans-serif';
      break;
    default:
      maxRes = 100;
      fontSize = '22px sans-serif';
      break;                 
  }
  return [maxRes,fontSize]
}

const labelFeatureRender = function (featureSets) {
  const labels = [];
  featureSets.forEach((featureSet) => {
    featureSet.features.forEach((f) => {
      const name = textFormatter(f.properties.name, 18, '\n');
      const values = radiusSorter(f);
      const label = new Feature({
        geometry: new Point(f.geometry.coordinates),
        name: name,
        type: f.properties.type,
        radius: f.properties.radius,
        maxRes: values[0],
        fontSize: values[1],
        src: f.properties.src
      });
      label.setId(f.id);
      labels.push(label);
    })
  })
  return labels;
}

const labelStyleCache = {};
const labelStyle = function(label, res) {
  if (res > label.get('maxRes')) return null;
  let style = labelStyleCache[label.get('id')];
  if (!style) {
    const fillColor = 
    style = new Style({
      text: new Text({
        font: label.get('fontSize'),
        text: label.get('name'),
        fill: new Fill({color: labelColors[label.get('type')]}),
        stroke: new Stroke({color: '#808080', width: 3}) 
      })
    })
    labelStyleCache[label.get('name')] = style;
  }
  return style;
}

const labels = labelFeatureRender(
  [brandsData,subdepartmentsData,departmentsData]
);

const labelFeatureSource = new VectorSource({
  features: labels
})

export const labelFeatureLayer = new VectorLayer({
  source: labelFeatureSource,
  style: labelStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true
})

const circleFeatureRender = function(featureSets) {
  const circles = [];
  featureSets.forEach((featureSet) => {
    featureSet.features.forEach((f) => {
      const values = radiusSorter(f);
      const type = f.properties.type;
      const circle = new Feature({
        geometry: new Circle(f.geometry.coordinates, f.properties.radius || (75 * Math.sqrt(2))),
        name: f.properties.name,
        type: type,
        radius: f.properties.radius,
        maxRes: values[0],
        color: circleColors[type]
      });
      circle.setId(f.id);
      circles.push(circle);
    })
  })
  return circles;    
}

const circleStyleCache = {};
const circleStyle = function(circle, res) {
  if (res > circle.get('maxRes')) return null;
  let style = circleStyleCache[circle.get('type')];
  if (!style) {
    style = new Style({
      fill: new Fill({color: circle.get('color')})
    })
    circleStyleCache[circle.get('type')] = style;
  }
  return style;
}

const circles = circleFeatureRender(
  [departmentsData,subdepartmentsData,brandsData]
);

const circleFeatureSource = new VectorSource({
  features: circles
})

export const circleFeatureLayer = new VectorLayer({
  source: circleFeatureSource,
  style: circleStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true
})

const imageStyleCache = {};
const imageIconCache = {};
const imageStyle = function(image, res) {
  if (res > image.get('maxRes')) return null;
  let style = imageStyleCache[image.get('src')];
  if (!style) {
    let icon = imageIconCache[image.get('src')];
    const scale = (2*image.get('radius')/ res) / 600;
    if (!icon) {
      icon = new Icon({
        src: '../product-images/category-images/test-circle.png'/* + (image.get('src') || 'default.jpg') */ ,
        size: [200,200],
        crossOrigin: 'anonymous',
        // anchorXUnits: 'pixel',
        // anchorYUnits: 'pixel',
        // anchor: [2*image.get('radius')/res,2*image.get('radius')/res],
        scale: scale > .3 ? scale : .3 
      })
      imageIconCache[image.get('src')] = icon;
    }
    style = new Style({
      image: icon
    })
    imageStyleCache[image.get('type')] = style;
  }
  return style;
}

const imageFeatureSource = new VectorSource({
  features: labelFeatureRender([departmentsData])
})

export const imageFeatureLayer = new VectorLayer({
  source: imageFeatureSource,
  style: imageStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true
})
