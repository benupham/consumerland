import Feature from 'ol/feature';
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
import {textFormatter, dataTool, getFeatureJson, getFeaturesFromFirestore} from '../utilities.js';
import {view, map} from '../index.js';

/*
* Label Features
* 
*/



const labelFeatureRender = function (featureSets, type='all') {
  const rangeData = d3Array.histogram()
  .value(d => {
    if (d.properties.type == type || type == 'all') return d.properties.radius;
  })
  .thresholds(6);
  const labels = [];
  featureSets.forEach((featureSet) => {
    const range = rangeData(featureSet);
    featureSet.forEach((f) => {
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
    featureSet.forEach((f) => {
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
    featureSet.forEach((f) => {
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
    extent = d3Array.extent(featureSets[0], function(f) {
      if (type === f.properties.type || type === 'all') {
        return f.properties.radius  
      } 
    });
    console.log(extent);    
  }
  if (featureSets.length != 1) console.log(featureSets);

  featureSets.forEach((featureSet) => {
    featureSet.forEach((f) => {
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

// This is used for category labels only
const maxResData = d3Array.histogram()
.value(d => d.properties.radius)
.thresholds([200,400,600,800,1600,2000,2800,3500]);



const setMaxRange = function(features, range) {
  features.forEach((f) => {
    for (let i = 0; i < range.length; i++) {
      for (let j = 0; j < range[i].length; j++) {
        if (range[i][j].id == f.id) {
          f.properties.maxRes = maxResolutions[i];
          break;
        }
      }
    }  
  })  
}

// Dept Layers defined outside of Promise so they can be exported to the OverviewMap control
const deptCircleSource = new VectorSource();
const deptLabelSource = new VectorSource();

export const departmentsCircleLayer = new VectorLayer({
  style: circleStyle,
  source: deptCircleSource,
  zIndex: 0,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
});
export const departmentsLabelLayer = new VectorLayer({
  style: labelStyle,
  source: deptLabelSource,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  zIndex: 10,
  minResolution: deptsLabelMin,
  maxResolution: deptsLabelMax
});

export let maxExtent = [];

// getFeaturesFromFirestore('categoryfeatures')
// .then(snapshot => {
//   const features = [];
//   for (let f of snapshot.docs) {
//       features.push(f.data());
//     } 
//   console.log(features);
// }) 

getFeatureJson(['dept','subdept','brand'])
.then(res => {
  const featureData = res;
  const maxResRange = maxResData(featureData);
  setMaxRange(featureData, maxResRange);

  const deptCircleFeatures = circleFeatureRender([featureData], 'dept');
  deptCircleSource.addFeatures(deptCircleFeatures);
  const deptLabelFeatures = labelFeatureRender([featureData], 'dept');
  deptLabelSource.addFeatures(deptLabelFeatures);
  
  const departmentsImageLayer = new VectorLayer({
    source: new VectorSource({
      features: imageFeatureRender([featureData], 'dept')
    }),
    style: imageStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    zIndex: 9,
    minResolution: subdeptsImageMax,
    maxResolution: deptsImageMax
  })

  const subdepartmentsLabelLayer = new VectorLayer({
    source: new VectorSource({
      features: labelFeatureRender([featureData], 'subdept')
    }),
    style: labelStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    zIndex: 8,
    minResolution: subdeptsLabelMin,
    maxResolution: subdeptsLabelMax
  })
  
  const subdepartmentsImageLayer = new VectorLayer({
    source: new VectorSource({
      features: imageFeatureRender([featureData], 'subdept')
    }),
    style: imageStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    zIndex: 7,
    minResolution: subdeptsImageMin,
    maxResolution: subdeptsImageMax
  })
  
  const subdepartmentsCircleLayer = new VectorLayer({
    source: new VectorSource({
      features: circleFeatureRender([featureData], 'subdept')
    }),
    style: circleStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    zIndex: 1,
    minResolution: subdeptsCircleMin,
    maxResolution: subdeptsCircleMax
  })

  const brandsLabelLayer = new VectorLayer({
    source: new VectorSource({
      features: labelFeatureRender([featureData], 'brand')
    }),
    style: labelStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    zIndex: 6,
    minResolution: brandsLabelMin,
    maxResolution: brandsLabelMax
  })


const brandsImageLayer = new VectorLayer({
  source: new VectorSource({
    features: imageFeatureRender([featureData], 'brand')
  }),
  style: imageStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  zIndex: 5,
  minResolution: brandsImageMin,
  maxResolution: brandsImageMax
})

const brandsCircleLayer = new VectorLayer({
  source: new VectorSource({
    features: circleFeatureRender([featureData], 'brand')
  }),
  style: circleStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  zIndex: 2,
  minResolution: brandsCircleMin,
  maxResolution: brandsCircleMax
})

  map.addLayer(departmentsCircleLayer);
  map.addLayer(subdepartmentsCircleLayer);
  map.addLayer(brandsCircleLayer);
  map.addLayer(brandsImageLayer);
  map.addLayer(brandsLabelLayer);
  map.addLayer(subdepartmentsImageLayer);
  map.addLayer(subdepartmentsLabelLayer);
  map.addLayer(departmentsImageLayer);
  map.addLayer(departmentsLabelLayer);
  maxExtent = departmentsCircleLayer.getSource().getExtent();
  
})
.catch(err => console.log(err));

 


// Products

// Defined outside Promise so components can use productsSource for feature look-ups
export const productsSource = new VectorSource({
  overlaps: false
});


getFeaturesFromFirestore('product')
.then(snapshot => {
  const productData = [];
  for (let f of snapshot.docs) {
      productData.push(f.data());
    } 
  console.log(productData);  
  const imageFeatures = imageFeatureRender([productData], 'product');
  productsSource.addFeatures(imageFeatures);
  
  const productsImageLayer = new VectorLayer({
    source: productsSource,
    style: imageStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: false,
    zIndex: 4,
    maxResolution: productsImageMax
  });
  
  const productsCircleLayer = new VectorLayer({
    source: new VectorSource({
      features: circleFeatureRender([productData], 'product')
    }),
    style: circleStyle,
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    zIndex: 3,
    maxResolution: productsCircleMax
  });
  map.addLayer(productsCircleLayer);
  map.addLayer(productsImageLayer);
})
