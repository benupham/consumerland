import Feature from 'ol/feature';
import Point from 'ol/geom/point';
import CircleStyle from 'ol/style/circle';
import Stroke from 'ol/style/stroke';
import Icon from 'ol/style/icon';
import Fill from 'ol/style/fill';
import Text from 'ol/style/text';
import Style from 'ol/style/style';

const d3Array = require('d3-array');

import {
  imagesDir,
  labelColors,
  labelStyleChange,
  labelStrokes,
  labelStrokeWidth,
  imageScale,
  fontFamily,
  fontSizes,
  fontWeight,
  deptColors,
} from '../constants.js';
import {textFormatter} from '../utilities.js';
import {view} from '../index.js';
import { isNullOrUndefined } from 'util';

/*
* Label Features
* 
*/
export const labelFeatureRender = function (featureSets, type='all') {
  const rangeData = d3Array.histogram()
  .value(d => {
    if (d.properties.type == type || type == 'all') return d.properties.radius;
  })
  .thresholds(6);
  const labels = [];
  featureSets.forEach((featureSet) => {
    const range = rangeData(featureSet);
    featureSet.forEach((f) => {
      let fontSize = '12px Oswald';
      if (f.properties.type == type) {
        for (let i = 0; i < range.length; i++) {
          for (let j = 0; j < range[i].length; j++) {
            if (range[i][j].id == f.id) {
              // shrink font size a couple points depending on category level
              fontSize = fontSizes[i] - (['dept','subdept','brand'].indexOf(f.properties.type));
              break;
            }
          }
        }
        let name = textFormatter(f.properties.name, 18, '\n');
        const label = new Feature({
          geometry: new Point(f.geometry.coordinates),
          name: name,
          fid : f.id,
          type: f.properties.type,
          style: 'label',
          color: deptColors[f.properties.dept] || deptColors[f.id], 
          radius: f.properties.radius,
          fontSize: fontSize,
          maxRes: f.properties.maxRes
          //src: f.properties.src
        });
        label.setId(f.id + '-label');
        labels.push(label);        
      }
    })
  })
  return labels;
}

// LABEL STYLE 
const labelStyleCache = {};
const resolutionCache = {};

export const labelStyle = function(label, res) {
  if (label.get('maxRes') < view.getResolution()) return null;

  let style = labelStyleCache[label.getId()];

  if (!style && view.getResolution() <= labelStyleChange[label.get('type')]) {
    label.set('styleChange', true);
  } else if (resolutionCache[label.getId()] >= labelStyleChange[label.get('type')] 
  && view.getResolution() <= labelStyleChange[label.get('type')]) {
    label.set('styleChange', true);
    style = null;
  } else if (resolutionCache[label.getId()] <= labelStyleChange[label.get('type')] 
  && view.getResolution() >= labelStyleChange[label.get('type')]) {
    label.set('styleChange', false); 
    style = null;
  }
  const labelType = label.get('type');
  if (labelType === 'dept') label.set('styleChange', true);
  if (isNullOrUndefined(style)) {
    const styleChange = label.get('styleChange');

    const fontSize = styleChange === true ? label.get('fontSize')*1.5 : label.get('fontSize');
    const text = label.get('name');
    const textAlign = styleChange === true ? 'center' : 'left';
    const offsetX = styleChange === true ? 0 : imageScale[labelType] * 120;
    const backgroundFillColor = styleChange === true ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 0)'; 
    
    style = new Style({
      text: new Text({
        font: fontWeight[labelType] + ' ' + fontSize + 'px' + ' ' + fontFamily[labelType],
        text: text,
        textBaseline: 'middle',
        textAlign: textAlign,
        offsetX: offsetX,
        fill: new Fill({color: label.get('color')}),
        stroke: new Stroke({color: labelStrokes[labelType], width: labelStrokeWidth[labelType]}) ,
        backgroundFill: new Fill({color: backgroundFillColor}),
        padding: [0,3,0,3]
      })
    })
    labelStyleCache[label.getId()] = style;
    resolutionCache[label.getId()] = view.getResolution();
  }

  return style;
}

/*
* Image Features (for categories)
* 
*/

export const imageFeatureRender = function (featureSets, type='all') {
  const images = [];
  let extent = [];
  if (featureSets.length === 1) {
    extent = d3Array.extent(featureSets[0], function(f) {
      if (type === f.properties.type) {
        return f.properties.radius  
      } 
    });
  }

  featureSets.forEach((featureSet) => {
    featureSet.forEach((f) => {
      if ((f.properties.type === type || type === 'all'))  {
        const src = imagesDir + (f.properties.sampleImg || f.properties.src); 
        const image = new Feature({
          geometry: new Point(f.geometry.coordinates),
          name: f.properties.name,
          fid: f.id,
          price: f.properties.price || '',
          type: f.properties.type,
          style: 'image',
          color: deptColors[f.properties.dept] || deptColors[f.id],
          radius: f.properties.radius,
          relativeRadius: f.properties.radius / extent[1],
          src: src,
          maxRes: f.properties.maxRes
        });
        image.setId(f.id + '-image');
        images.push(image);        
      }
    })
  })
  return images;
}

const imageStyleCache = {};
const imageIconCache = {};

export const imageStyle = function(image, res) {
  if (image.get('maxRes') < view.getResolution()) return null;
  
  let style = imageStyleCache[image.get('src')];
  
  if (!style) {
    let icon = imageIconCache[image.get('src')];
    const scaleFactor = imageScale[image.get('type')];
    const radius = image.get('radius');
    const imgRadius = image.get('radius') / res;
    // console.log(imgRadius)
    const scale = image.get('relativeRadius') > .7 ? image.get('relativeRadius') : .7;//radius/65 * 2 > 200 ? 1 : radius/65 * 2 / 200;
    if (!icon) {
      icon = new Icon({
        src: image.get('src'),
        size: [200,200],
        // crossOrigin: 'anonymous',
        scale: radius / 200 / res,
        anchor: [0.5, 0.5]
      })
      imageIconCache[image.get('src')] = icon;
    }
    const circleStyle = new Style({
      image: new CircleStyle({
        fill: new Fill({
          color: '#fff'
        }),
        stroke: new Stroke({
          color: image.get('color'),
          width: 3
        }),
        radius: imgRadius
      })
    }); 
    const Iconstyle = new Style({
      image: icon 
    })
    style = [circleStyle, Iconstyle];
    imageStyleCache[image.get('type')] = style;
  }
  if (image.get('type') == 'product') style.getImage().setScale(1/ res);
  return style;
}



