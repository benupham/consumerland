import has from 'ol/has';

import {view, map} from '../index.js';
import {productsImageMax, searchResolutions} from '../constants.js';
import {debounce} from '../utilities.js';
import {updatePreview, hidePreview} from '../components/productPreview.js';
import {setCartAddIcon} from '../features/tags2.js';

export let jumpStripsInt = null;
let highlight = {}; 

export const handleHover = function(e) {
  // Turns off all hover events for touch devices. 
  if (has.TOUCH === true) return;
  
  debounce(updatePreview, 500).call(null, e);

  const resolution = view.getResolution();
  const size = map.getSize();

  if (jumpStripsInt != null) {
    window.clearInterval(jumpStripsInt);
    window.jumpStripActive = false; 
  }

  if (map.hasFeatureAtPixel(e.pixel)) {
    map.getTargetElement().style.cursor = 'pointer';
    const features = map.getFeaturesAtPixel(e.pixel, {
      layerFilter: (layer) => { return layer.get('name') != 'tag-layer' ? true : false}
    });

    
    const feature = features[0];
    const featureType = feature.get('type');
    const featureStyle = feature.get('style');
    const pId = feature.getId();

    if (featureType == 'add' || (featureType == 'product' && featureStyle == 'image')) {
      setCartAddIcon(feature);
    } 
    else if ((featureType == 'brand' || 'dept' || 'subdept') && (featureStyle === 'circle')) {

      setMouseCursor(featureType, resolution);

      setCartAddIcon(false);
      if (feature != highlight[featureType]) {
        
        if (highlight[featureType] && (featureType === highlight[featureType].get('type'))) {
          
          highlight[featureType].set('hover', false);
          feature.dispatchEvent('change');
        }
        feature.set('hover', true);
        feature.dispatchEvent('change');
        highlight[featureType] = feature;
      }

    } 
  } else {
    hidePreview();
    map.getTargetElement().style.cursor = 'auto';
    for (let key in highlight) {
      highlight[key].set('hover', false);
    }
  }
}

const setMouseCursor = function(type = null, res = null) {
  const map = document.getElementById('map');
  if (res > searchResolutions[type]) {
    map.style.cursor = 'zoom-in';
  } else if (res < searchResolutions[type]) {
    map.style.cursor = 'zoom-out';
  } else {
    map.style.cursor = 'pointer';
  }
}