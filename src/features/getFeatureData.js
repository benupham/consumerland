import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';


const d3Array = require('d3-array');

import {productImageFeatureRender, productImageStyle, productLabelFeatureRender, productLabelStyle} from './products';
import {circleFeatureRender, circleStyle} from './circles';
import {labelFeatureRender, labelStyle, imageFeatureRender, imageStyle} from './labels';
import {tagsFeatureRender, tagsStyle, cartAddIcon} from './tags2';
import {omnibox} from '../components/omnibox';

import {
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
  deptsImageMax,
  deptsImageMin,
  maxResolutions,
  productsLabelMax,
} from '../constants.js';
import {textFormatter, dataTool, getFeatureJson, getFeaturesFromFirestore} from '../utilities.js';
import {view, map} from '../index.js';
import { isNullOrUndefined } from 'util';




// These two functions create a universal maximum resolution for all category features
// They are applied when data is first collected, rather than on a per-layer basis
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

/*
* Exports
*/

// Exported so components can use productsSource for feature look-ups
export const productsSource = new VectorSource({overlaps: false});
const productsCircleSource = new VectorSource({overlaps: false});
const productsLabelSource = new VectorSource();
export const tagsSource = new VectorSource({overlaps: false});
const deptsCircleSource = new VectorSource({overlaps: false});
const deptsLabelSource = new VectorSource();
const deptsImageSource = new VectorSource();
const subdeptsCircleSource = new VectorSource({overlaps: false});
const subdeptsLabelSource = new VectorSource();
const subdeptsImageSource = new VectorSource();
const brandsCircleSource = new VectorSource({overlaps: false});
const brandsLabelSource = new VectorSource();
const brandsImageSource = new VectorSource();


const productsImageLayer = new VectorLayer({
  source: productsSource,
  style: productImageStyle,
  renderMode: 'raster',
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  zIndex: 3,
  maxResolution: productsImageMax
});

const productsCircleLayer = new VectorLayer({
  source: productsCircleSource,
  renderMode: 'raster',
  style: circleStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  zIndex: 2,
  maxResolution: productsCircleMax
});

const productsLabelLayer = new VectorLayer({
  source: productsLabelSource,
  style: productLabelStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  renderBuffer: 150,
  maxResolution: productsLabelMax,
  zIndex: 4
})

export const tagsLayer = new VectorLayer({
  source: tagsSource,
  style: tagsStyle,
  zIndex: 4,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  renderMode: 'vector',
  maxResolution: productsImageMax 
})

// Exported to be used in Overview Map
export const deptsCircleLayer = new VectorLayer({
  style: circleStyle,
  source: deptsCircleSource,
  zIndex: 0,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
});

export const deptsLabelLayer = new VectorLayer({
  style: labelStyle,
  source: deptsLabelSource,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  zIndex: 10,
  minResolution: deptsLabelMin,
  maxResolution: deptsLabelMax
});

const deptsImageLayer = new VectorLayer({
  source: deptsImageSource,
  style: imageStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  zIndex: 9,
  minResolution: subdeptsImageMax,
  maxResolution: deptsImageMax
})


const subdeptsLabelLayer = new VectorLayer({
  source: subdeptsLabelSource,
  style: labelStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  zIndex: 8,
  minResolution: subdeptsLabelMin,
  maxResolution: subdeptsLabelMax
})

const subdeptsImageLayer = new VectorLayer({
  source: subdeptsImageSource,
  style: imageStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  zIndex: 7,
  minResolution: subdeptsImageMin,
  maxResolution: subdeptsImageMax
})

const subdeptsCircleLayer = new VectorLayer({
  source: subdeptsCircleSource,
  style: circleStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  zIndex: 1,
  minResolution: subdeptsCircleMin,
  maxResolution: subdeptsCircleMax,
  opacity: 0.4
})

const brandsLabelLayer = new VectorLayer({
  source: brandsLabelSource,
  style: labelStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  zIndex: 6,
  minResolution: brandsLabelMin,
  maxResolution: brandsLabelMax
})


const brandsImageLayer = new VectorLayer({
  source: brandsImageSource,
  style: imageStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  zIndex: 5,
  minResolution: brandsImageMin,
  maxResolution: brandsImageMax
})

const brandsCircleLayer = new VectorLayer({
  source: brandsCircleSource,
  style: circleStyle,
  updateWhileAnimating: true,
  updateWhileInteracting: true,
  zIndex: 2,
  minResolution: brandsCircleMin,
  maxResolution: brandsCircleMax,
  opacity: 1
})


// This is defined when dept circles are finished loading, to create bounding area for map
export let maxExtent = [];

// Array of all feature data for use by other components
export let featureData = [];

getFeatureJson(['dept','subdept','brand'], 'categoryfeatures')
.then(categoryData => {

  // Apply max range algorithm to all categories
  const maxResRange = maxResData(categoryData);
  setMaxRange(categoryData, maxResRange);

  // Add feature data to category sources 
  deptsCircleSource.addFeatures(circleFeatureRender([categoryData], 'dept'));
  deptsLabelSource.addFeatures(labelFeatureRender([categoryData], 'dept'));
  deptsImageSource.addFeatures(imageFeatureRender([categoryData], 'dept'));

  subdeptsCircleSource.addFeatures(circleFeatureRender([categoryData], 'subdept'));
  subdeptsLabelSource.addFeatures(labelFeatureRender([categoryData], 'subdept'));
  subdeptsImageSource.addFeatures(imageFeatureRender([categoryData], 'subdept'));
  
  brandsCircleSource.addFeatures(circleFeatureRender([categoryData], 'brand'));
  brandsLabelSource.addFeatures(labelFeatureRender([categoryData], 'brand'));
  brandsImageSource.addFeatures(imageFeatureRender([categoryData], 'brand'));

  //map.addLayer(productsCircleLayer);

  // map.addLayer(deptsCircleLayer);
  map.addLayer(subdeptsCircleLayer);
  map.addLayer(brandsCircleLayer);
  map.addLayer(brandsImageLayer);
  // map.addLayer(brandsLabelLayer);
  map.addLayer(subdeptsImageLayer);
  // map.addLayer(subdeptsLabelLayer);
  //map.addLayer(deptsImageLayer);
  map.addLayer(deptsLabelLayer);

  maxExtent = deptsCircleLayer.getSource().getExtent();

  return categoryData; 
  
})
.then(categoryData => {
  getFeatureJson(['product'], 'productsfeatures')
  .then(productData => {
  
    productsSource.addFeatures(productImageFeatureRender([productData], 'product'));
    // productsCircleSource.addFeatures(circleFeatureRender([productData], 'product'));
    productsLabelSource.addFeatures(productLabelFeatureRender([productData], 'product'));

    tagsSource.addFeatures(tagsFeatureRender(productData));
    tagsSource.addFeature(cartAddIcon);
    tagsLayer.set('name','tag-layer');

    map.addLayer(tagsLayer);
    map.addLayer(productsImageLayer);
    // map.addLayer(productsCircleLayer);
    map.addLayer(productsLabelLayer);
  
    featureData = categoryData.concat(productData);

    omnibox.getFeatureData(featureData);
    
  })
  .then(() => {
    document.querySelector('.loading').style.display = 'none';
  })
}) 
.catch(err => console.log(err));





