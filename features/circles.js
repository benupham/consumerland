import Feature from 'ol/feature';
import Circle from 'ol/geom/circle';
import Fill from 'ol/style/fill';
import Style from 'ol/style/style';

import {
  imagesDir,
  circleColors,
  circleHoverColors
} from '../constants.js';


/*
* Circle Features
* 
*/

export const circleFeatureRender = function(featureSets, type='all') {
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

export const circleStyle = function(circle, res) {
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




