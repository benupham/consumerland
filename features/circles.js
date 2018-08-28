import Feature from 'ol/feature';
import Point from 'ol/geom/point';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Circle from 'ol/geom/circle';
import Polygon from 'ol/geom/polygon';
import CircleStyle from 'ol/style/circle';
import Stroke from 'ol/style/stroke';
import Icon from 'ol/style/icon';
import Fill from 'ol/style/fill';
import Text from 'ol/style/text';
import Style from 'ol/style/style';

const d3Array = require('d3-array');

import {
  imagesDir,
  productsImageMax,
  productsCircleMax,
  brandsLabelMax,
  brandsLabelMin,
  brandsCircleMax,
  brandsCircleMin,
  brandsImageMax,
  brandsImageMin,
  subdeptsLabelMax,
  subdeptsLabelMin,
  subdeptsCircleMax,
  subdeptsCircleMin,
  subdeptsImageMax,
  subdeptsImageMin,
  deptsLabelMax,
  deptsLabelMin,
  deptsCircleMax,
  deptsCircleMin,
  deptsImageMax,
  deptsImageMin,
  maxResolutions,
  labelColors,
  labelStyleChange,
  labelBackgroundColors,
  labelStrokes,
  labelStrokeWidth,
  circleLabelColors,
  circleColors,
  circleHoverColors,
  imageScale,
  fontFamily,
  fontSizes,
  fontSizesByType,
  fontWeight,
} from '../constants.js';
import {textFormatter, dataTool, getFeatureJson, getFeaturesFromFirestore} from '../utilities.js';
import {view, map} from '../index.js';
import { isNullOrUndefined } from 'util';

/*
* Circle Features
* 
*/

const circleFeatureRender = function(featureSets, type='all') {
  const circles = [];
  featureSets.forEach((featureSet) => {
    featureSet.forEach((f) => {
      if (f.properties.type == type || type == 'all') {
        const type = f.properties.type;
        const color = circleColors[type];
        const hoverColor = circleHoverColors[type];
        const circle = new Feature({
          geometry: new Circle(f.geometry.coordinates, f.properties.radius || (100 * Math.sqrt(2))),
          name: f.properties.name,
          fid: f.id,
          type: type,
          style: 'circle',
          radius: f.properties.radius,
          color: color,
          hover: false,
          hoverColor: hoverColor,
          src: imagesDir + (f.properties.sampleImg || f.properties.src),
          children: f.properties.value || '' 
        });
        circle.setId(f.id + '-circle');
        circles.push(circle);        
      }
    })
  })
  return circles;    
}

const circleStyleCache = {};
const circleStyleHoverCache = {};

const circleStyle = function(circle, res) {
  const hover = circle.get('hover');
  let style = hover === false ? circleStyleCache[circle.getId()] : circleStyleHoverCache[circle.getId()];
  if (!style && hover === false) {
    style = new Style({
      fill: new Fill({color: circle.get('color')})
    })
    circleStyleCache[circle.getId()] = style;
  } else if (!style && hover === true) {
    style = new Style({
      fill: new Fill({color: circle.get('hoverColor')})
    })
    circleStyleHoverCache[circle.getId()] = style;
  }
  return style;
}




