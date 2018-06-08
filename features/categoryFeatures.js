import Feature from 'ol/feature';
import Collection from 'ol/collection';
import Point from 'ol/geom/point';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Circle from 'ol/geom/circle';
import Polygon from 'ol/geom/polygon';
import Stroke from 'ol/style/stroke';
import Icon from 'ol/style/icon';
import Fill from 'ol/style/fill';
import Text from 'ol/style/text';
import Style from 'ol/style/style';

const d3Array = require('d3-array');
// const d3Scale = require('d3-scale');
// const d3Chromatic = require('d3-scale-chromatic');
// const d3Color = require('d3-color');

import {allFeatureData} from '../data/allFeatureDataCollection.js';
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
  colors,
  labelColors,
  labelBackgroundColors,
  labelStrokes,
  circleLabelColors,
  circleColors,
  circleHoverColors,
  fontFamily,
  fontSizes,
  fontWeight,
} from '../constants.js';
import {textFormatter, dataTool} from '../utilities.js';
import {view} from '../index.js';


// const colorSchemes = [
//   d3Chromatic.schemeBuGn[4],
//   d3Chromatic.schemeBuPu[4],
//   d3Chromatic.schemeOrRd[4],
//   d3Chromatic.schemePuBu[4],
//   d3Chromatic.schemeYlGnBu[4],
//   d3Chromatic.schemeYlOrBr[4],
// ]


// const deptColorSchemes = {};
// const deptColors = {};
// allFeatureData.features.forEach((f, i) => {
//   if (f.properties.type === 'dept') {
//     f.properties.colorScheme =  d3Chromatic.schemeGreys[5];//colorSchemes[4];
//     deptColorSchemes[f.properties.name] = f.properties.colorScheme;
//     const color = f.properties.colorScheme[Math.floor(Math.random() * f.properties.colorScheme.length)];
//     f.properties.color = d3Color.color(color);
//     deptColors[f.properties.name] = f.properties.color;
//     f.properties.color.opacity = 0.7;
//     f.properties.hoverColor = f.properties.color.darker(0.3);
//     console.log(f.properties.name, colorSchemes.indexOf(f.properties.colorScheme));
//   }
// })
// allFeatureData.features.forEach((f, i) => {
//   if (f.properties.type === 'subdept') {
//     const parent = f.properties.parent;
//     const parentColors = deptColorSchemes[parent];
//     const parentColor = deptColors[parent];
//     const color = parentColors[Math.floor(Math.random() * parentColors.length)];
//     // const color = parentColor;
//     f.properties.color = d3Color.color(color);
//     f.properties.color.opacity = 0.3 //Math.random();
//     f.properties.hoverColor = f.properties.color.darker(0.3);
//     console.log(f.properties.name, f.properties.hoverColor);
//   }
// })


/*
* Label Features
* 
*/

// This is used for category labels only
const maxResData = d3Array.histogram()
.value(d => {
  if (d.properties.type != 'product') return d.properties.radius;
})
.thresholds([200,400,600,800,1600,2000,2800,3500]);

const maxResRange = maxResData(allFeatureData.features);

allFeatureData.features.forEach((f) => {
  for (let i = 0; i < maxResRange.length; i++) {
    for (let j = 0; j < maxResRange[i].length; j++) {
      if (maxResRange[i][j].id == f.id) {
        f.properties.maxRes = maxResolutions[i];
        break;
      }
    }
  }  
})

const labelFeatureRender = function (featureSets, type='all') {
  const rangeData = d3Array.histogram()
  .value(d => {
    if (d.properties.type == type || type == 'all') return d.properties.radius;
  })
  .thresholds(6);
  const labels = [];
  featureSets.forEach((featureSet) => {
    const range = rangeData(featureSet.features);
    featureSet.features.forEach((f) => {
      let fontSize = '12px Arial';
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
        name = f.properties.type === 'dept' ? name.toUpperCase() : name;
        const label = new Feature({
          geometry: new Point(f.geometry.coordinates),
          name: name,
          fid : f.id,
          type: f.properties.type,
          style: 'label',
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


const labelStyleCache = {};
const labelStyle = function(label, res) {
  // if (label.get('radius') < 200) return null;
  if (label.get('maxRes') < view.getResolution()) return null;
  let style = labelStyleCache[label.get('id')];
  if (!style) {
    const fillColor = 
    style = new Style({
      text: new Text({
        font: fontWeight[label.get('type')] + ' ' + label.get('fontSize') + 'px' + ' ' + fontFamily[label.get('type')],
        text: label.get('name'),
        textBaseline: 'middle',
        fill: new Fill({color: labelColors[label.get('type')]}),
        stroke: new Stroke({color: labelStrokes[label.get('type')], width: 1}) ,
        backgroundFill: new Fill({color: labelBackgroundColors[label.get('type')]}),
        padding: [0,5,0,5]
      })
    })
    labelStyleCache[label.get('name')] = style;
  }
  return style;
}

/*
* Circle Features
* 
*/

const circleFeatureRender = function(featureSets, type='all') {
  const circles = [];
  featureSets.forEach((featureSet) => {
    featureSet.features.forEach((f) => {
      if (f.properties.type == type || type == 'all') {
        const type = f.properties.type;
        const color = /* f.properties.color ? f.properties.color.toString() : */ circleColors[type];
        const hoverColor = /* f.properties.hoverColor ? f.properties.hoverColor.toString() : */ circleHoverColors[type];
        const circle = new Feature({
          geometry: new Circle(f.geometry.coordinates, f.properties.radius || (100 * Math.sqrt(2))),
          name: f.properties.name,
          fid: f.id,
          type: type,
          style: 'circle',
          radius: f.properties.radius,
          color: color,
          hoverColor: hoverColor,
        });
        circle.setId(f.id + '-circle');
        circles.push(circle);        
      }
    })
  })
  return circles;    
}

const circleStyleCache = {};

const circleStyle = function(circle, res) {

  let style = circleStyleCache[circle.get('fid')];
  if (!style) {
    style = new Style({
      fill: new Fill({color: circle.get('color')})
      // stroke: new Stroke({color: circle.get('color'), width: 5})
    })
    circleStyleCache[circle.get('fid')] = style;
  }
  // if (circle.get('hover') == true) {
  //   style.getFill().setColor(circle.get('hoverColor'));
  //   // style.getStroke().setColor(circle.get('hoverColor'));
  // }
  // if (circle.get('hover') == false) {
  //   style.getFill().setColor(circle.get('color'));
  //   // style.getStroke().setColor(circle.get('color'));
  // }
  circleStyleCache[circle.get('fid')] = style;
  return style;
}


/*
* Circle Labels Features
* 
*/

const circleLabelRender = function(featureSets, type='all') {
  const circles = [];
  featureSets.forEach((featureSet) => {
    featureSet.features.forEach((f) => {
      if (f.properties.type == type || type == 'all') {
        const type = f.properties.type;
        const circle = new Feature({
          geometry: new Polygon.fromCircle(
            new Circle(f.geometry.coordinates, f.properties.radius || 100), 128
          ),
          name: f.properties.name,
          fid: f.id,
          type: type,
          style: 'circlelabel',
          radius: f.properties.radius,
          color: circleLabelColors[type],
          hoverColor: circleHoverColors[type],
        });
        circle.setId(f.id + '-circlelabel');
        circles.push(circle);        
      }
    })
  })
  return circles;    
}

const circleLabelStyleCache = {};
const circleLabelStyle = function(circleLabel, res) {
  let style = circleLabelStyleCache[circleLabel.get('id')];
  if (!style) {
    const fillColor = 
    style = new Style({
      text: new Text({
        font: circleLabel.get('fontSize'),
        text: circleLabel.get('name'),
        placement: 'line',
        textBaseline: 'bottom',
        textAlign: 'end',
        maxAngle: Math.PI,
        fill: new Fill({color: circleLabelColors[circleLabel.get('type')]}),
        stroke: new Stroke({color: '#fff', width: 2}) ,
        //backgroundFill: new Fill({color: 'rgba(0,0,0,1'}),
        //padding: [0,5,0,5]
      })
    })
    circleLabelStyleCache[circleLabel.get('name')] = style;
  }
  return style;
}


/*
* Image Features
* 
*/

const imageFeatureRender = function (featureSets, type='all') {
  const images = [];
  let extent = [];
  if (featureSets.length === 1) {
    extent = d3Array.extent(featureSets[0].features, function(f) {
      if (type === f.properties.type || type === 'all') {
        return f.properties.radius  
      } 
    });
    console.log(extent);    
  }
  if (featureSets.length != 1) console.log(featureSets);

  featureSets.forEach((featureSet) => {
    featureSet.features.forEach((f) => {
      if (((f.properties.src).indexOf('.') > -1) && (f.properties.type === type || type === 'all'))  {
        const name = textFormatter(f.properties.name, 18, '\n');
        const src = imagesDir + f.properties.src; 
        const image = new Feature({
          geometry: new Point(f.geometry.coordinates),
          name: f.properties.name,
          fid: f.id,
          price: f.properties.price || '',
          type: f.properties.type,
          style: 'image',
          radius: f.properties.radius,
          relativeRadius: f.properties.radius / extent[1],
          src: src
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
const imageStyle = function(image, res) {
  let style = imageStyleCache[image.get('src')];
  if (!style) {
    let icon = imageIconCache[image.get('src')];
    const scaleFactor = image.get('type') === 'subdept' ? .8 : 1;
    const radius = image.get('radius');
    const scale = image.get('relativeRadius') > .5 ? image.get('relativeRadius') : .5;//radius/65 * 2 > 200 ? 1 : radius/65 * 2 / 200;
    if (!icon) {
      icon = new Icon({
        src: image.get('src'),
        size: [200,200],
        crossOrigin: 'anonymous',
        scale: scale * scaleFactor
      })
      imageIconCache[image.get('src')] = icon;
    }
    style = new Style({
      image: icon
    })
    imageStyleCache[image.get('type')] = style;
  }
  if (image.get('type') == 'product') style.getImage().setScale(1/ res);
  return style;
}

/*
* Exports
*/


// Departments

export const departmentsLabelLayer = new VectorLayer({
  source: new VectorSource({
    features: labelFeatureRender([allFeatureData], 'dept')
  }),
  style: labelStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  minResolution: deptsLabelMin,
  maxResolution: deptsLabelMax
})

// export const departmentsCircleLabelLayer = new VectorLayer({
//   source: new VectorSource({
//     features: circleLabelRender([allFeatureData], 'dept')
//   }),
//   style: circleLabelStyle,
//   updateWhileAnimating: true,
//   updateWhileInteracting: true,
//   maxResolution: 10
//   //maxResolution: null
// })

export const departmentsImageLayer = new VectorLayer({
  source: new VectorSource({
    features: imageFeatureRender([allFeatureData], 'dept')
  }),
  style: imageStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  minResolution: subdeptsImageMax,
  maxResolution: deptsImageMax
})

export const departmentsCircleLayer = new VectorLayer({
  source: new VectorSource({
    features: circleFeatureRender([allFeatureData], 'dept')
  }),
  style: circleStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
})

// Subdepartments

export const subdepartmentsLabelLayer = new VectorLayer({
  source: new VectorSource({
    features: labelFeatureRender([allFeatureData], 'subdept')
  }),
  style: labelStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  minResolution: subdeptsLabelMin,
  maxResolution: subdeptsLabelMax
})

export const subdepartmentsImageLayer = new VectorLayer({
  source: new VectorSource({
    features: imageFeatureRender([allFeatureData], 'subdept')
  }),
  style: imageStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  minResolution: subdeptsImageMin,
  maxResolution: subdeptsImageMax
})

export const subdepartmentsCircleLayer = new VectorLayer({
  source: new VectorSource({
    features: circleFeatureRender([allFeatureData], 'subdept')
  }),
  style: circleStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  minResolution: subdeptsCircleMin,
  maxResolution: subdeptsCircleMax
})

// Brands

export const brandsLabelLayer = new VectorLayer({
  source: new VectorSource({
    features: labelFeatureRender([allFeatureData], 'brand')
  }),
  style: labelStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  minResolution: brandsLabelMin,
  maxResolution: brandsLabelMax
})

// export const brandsCircleLabelLayer = new VectorLayer({
//   source: new VectorSource({
//     features: circleLabelRender([allFeatureData], 'brand')
//   }),
//   style: circleLabelStyle,
//   updateWhileAnimating: true,
//   updateWhileInteracting: true,
//   maxResolution: 10
// })

export const brandsImageLayer = new VectorLayer({
  source: new VectorSource({
    features: imageFeatureRender([allFeatureData], 'brand')
  }),
  style: imageStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  minResolution: brandsImageMin,
  maxResolution: brandsImageMax
})

export const brandsCircleLayer = new VectorLayer({
  source: new VectorSource({
    features: circleFeatureRender([allFeatureData], 'brand')
  }),
  style: circleStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  minResolution: brandsCircleMin,
  maxResolution: brandsCircleMax
})

// Products

// Product Source

export const productsSource = new VectorSource({
  features: imageFeatureRender([allFeatureData], 'product')
})
export const productsImageLayer = new VectorLayer({
  source: productsSource,
  style: imageStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: false,
  maxResolution: productsImageMax
})

export const productsCircleLayer = new VectorLayer({
  source: new VectorSource({
    features: circleFeatureRender([allFeatureData], 'product')
  }),
  style: circleStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  opacity: 1,
  maxResolution: productsCircleMax
})

