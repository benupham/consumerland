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
// import {histogram} from 'd3-array';
const d3Array = require('d3-array');

import {allFeatureData} from '../data/allFeatureDataCollection.js';
import {
  colors,
  labelColors,
  circleLabelColors,
  circleColors,
  circleHoverColors,
  productsImageMax,
  fontFamily,
  fontSizes,
} from '../constants.js';
import {textFormatter, dataTool} from '../utilities.js';



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
    const range = rangeData(featureSet.features);
    featureSet.features.forEach((f) => {
      let fontSize = '12px Arial';
      if (f.properties.type == type) {
        for (let i = 0; i < range.length; i++) {
          for (let j = 0; j < range[i].length; j++) {
            if (range[i][j].id == f.id) {
              fontSize = fontSizes[i];
              break;
            }
          }
        }
        const name = textFormatter(f.properties.name, 18, '\n');
        const label = new Feature({
          geometry: new Point(f.geometry.coordinates),
          name: name,
          fid : f.id,
          type: f.properties.type,
          style: 'label',
          //radius: f.properties.radius,
          fontSize: fontSize,
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
  //if (res > label.get('maxRes')) return null;
  let style = labelStyleCache[label.get('id')];
  if (!style) {
    const fillColor = 
    style = new Style({
      text: new Text({
        font: label.get('fontSize') + 'px' + ' ' + fontFamily[label.get('type')],
        text: label.get('name'),
        textBaseline: 'middle',
        fill: new Fill({color: labelColors[label.get('type')]}),
        //stroke: new Stroke({color: '#808080', width: 3}) ,
        backgroundFill: new Fill({color: 'rgba(0,0,0,0.5'}),
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
        const circle = new Feature({
          geometry: new Circle(f.geometry.coordinates, f.properties.radius || (100 * Math.sqrt(2))),
          name: f.properties.name,
          fid: f.id,
          type: type,
          style: 'circle',
          radius: f.properties.radius,
          //maxRes: values[0],
          color: circleColors[type],
          hoverColor: circleHoverColors[type],
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
    })
    circleStyleCache[circle.get('fid')] = style;
  }
  if (circle.get('hover') == true) {
    style.getFill().setColor(circle.get('hoverColor'));
  }
  if (circle.get('hover') == false) {
    style.getFill().setColor(circle.get('color'));
  }
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
  featureSets.forEach((featureSet) => {
    featureSet.features.forEach((f) => {
      if (((f.properties.src).indexOf('.') > -1) && (f.properties.type === type || type === 'all'))  {
        const name = textFormatter(f.properties.name, 18, '\n');
        const src = f.properties.src; 
        const image = new Feature({
          geometry: new Point(f.geometry.coordinates),
          name: f.properties.name,
          fid: f.id,
          price: f.properties.price || '',
          type: f.properties.type,
          style: 'image',
          radius: f.properties.radius,
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
    const scaleFactor = image.get('type') == 'brand' ? 600 : 300;
    const scale = (2*image.get('radius')/ res) / scaleFactor;
    if (!icon) {
      icon = new Icon({
        src: '../' + image.get('src'),
        size: [200,200],
        crossOrigin: 'anonymous',
        scale: scale > .3 ? scale : .3 
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
  minResolution: 50,
  //maxResolution: null
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
  minResolution: 50,
  // maxResolution: 50
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
  minResolution: 10,
  maxResolution: 50
})

// export const subdepartmentsCircleLabelLayer = new VectorLayer({
//   source: new VectorSource({
//     features: circleLabelRender([allFeatureData], 'subdept')
//   }),
//   style: circleLabelStyle,
//   updateWhileAnimating: true,
//   updateWhileInteracting: true,
//   maxResolution: 10
// })

export const subdepartmentsImageLayer = new VectorLayer({
  source: new VectorSource({
    features: imageFeatureRender([allFeatureData], 'subdept')
  }),
  style: imageStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  minResolution: 10,
  maxResolution: 50
})

export const subdepartmentsCircleLayer = new VectorLayer({
  source: new VectorSource({
    features: circleFeatureRender([allFeatureData], 'subdept')
  }),
  style: circleStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
})

// Brands

export const brandsLabelLayer = new VectorLayer({
  source: new VectorSource({
    features: labelFeatureRender([allFeatureData], 'brand')
  }),
  style: labelStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  //minResolution: null,
  maxResolution: 10
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
  //minResolution: null,
  maxResolution: 10
})

export const brandsCircleLayer = new VectorLayer({
  source: new VectorSource({
    features: circleFeatureRender([allFeatureData], 'brand')
  }),
  style: circleStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  //minResolution: null,
  maxResolution: 50
})

// Products

export const productsImageLayer = new VectorLayer({
  source: new VectorSource({
    features: imageFeatureRender([allFeatureData], 'product')
  }),
  style: imageStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  //minResolution: null,
  maxResolution: productsImageMax
})

export const productsCircleLayer = new VectorLayer({
  source: new VectorSource({
    features: circleFeatureRender([allFeatureData], 'product')
  }),
  style: circleStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  //minResolution: null,
  maxResolution: productsImageMax
})

// Product Source

export const productsSource = new VectorSource({
  features: imageFeatureRender([allFeatureData], 'product')
})

// const labels = labelFeatureRender(
//   [brandsData,subdepartmentsData,departmentsData]
// );

// const labelFeatureSource = new VectorSource({
//   features: labels
// })

// export const labelFeatureLayer = new VectorLayer({
//   source: labelFeatureSource,
//   style: labelStyle,
//   updateWhileAnimating: true,
//   updateWhileInteracting: true
// })

// const circles = circleFeatureRender(
//   [departmentsData,subdepartmentsData,brandsData]
// );

// const circleFeatureSource = new VectorSource({
//   features: circles
// })

// export const circleFeatureLayer = new VectorLayer({
//   source: circleFeatureSource,
//   style: circleStyle,
//   updateWhileAnimating: true,
//   updateWhileInteracting: true
// })

// const departmentImageSource = new VectorSource({
//   features: labelFeatureRender([departmentsData])
// })

// export const departmentImageLayer = new VectorLayer({
//   source: departmentImageSource,
//   style: imageStyle,
//   updateWhileAnimating: true,
//   updateWhileInteracting: true,
//   minResolution: 90
// })

// const subdepartmentImageSource = new VectorSource({
//   features: labelFeatureRender([subdepartmentsData])
// })

// export const subdepartmentImageLayer = new VectorLayer({
//   source: subdepartmentImageSource,
//   style: imageStyle,
//   updateWhileAnimating: true,
//   updateWhileInteracting: true,
//   //minResolution: 90
// })
