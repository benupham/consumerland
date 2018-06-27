import has from 'ol/has';

import {view, map} from '../index.js';
import {productsImageMax} from '../constants.js';
import {debounce} from '../utilities.js';
import {productCardOverlay} from '../components/overlays.js';
import {updatePreview} from '../components/productPreview.js';
import {setCartAddIcon} from '../features/tags.js';
import {handleJumpStrips} from '../components/jumpstrips.js';
import {productsSource} from '../features/categoryFeatures.js';

export let jumpStripsInt = null;
let highlight = undefined; 

export const handleHover = function(e) {
  // Turns off all hover events for touch devices. 
  if (has.TOUCH === true) return;

  const resolution = view.getResolution();
  const size = map.getSize();

  if (jumpStripsInt != null) {
    window.clearInterval(jumpStripsInt);
    window.jumpStripActive = false; 
  }

  // if (resolution < view.getMaxResolution() && (e.pixel[0] < 100 || e.pixel[1] < 100 || e.pixel[0] > size[0] - 100 || e.pixel[1] > size[1] - 100)) {
  //   jumpStripsInt = window.setInterval(handleJumpStrips, 16, e);
  //   hideOverlay(productCardOverlay);
  //   return
  // } else if (jumpStripsInt != null) {
  //   window.clearInterval(jumpStripsInt);
  //   map.getTargetElement().style.cursor = '';
  //   window.jumpStripActive = false;
  // }

  if (map.hasFeatureAtPixel(e.pixel)) {
    map.getTargetElement().style.cursor = 'pointer';
    const features = map.getFeaturesAtPixel(e.pixel, {
      layerFilter: (layer) => { return layer.get('name') != 'tag-layer' ? true : false}
    });
    debounce(updatePreview, 100).call(null, features);
    const feature = features[0];
    const featureType = feature.get('type');
    console.log(featureType);
    const featureStyle = feature.get('style');
    const pId = feature.getId();

    if (featureType == 'add' || (featureType == 'product' && featureStyle == 'image')) {
      setCartAddIcon(feature);
    } 
    else if (featureType == 'brand' || 'dept' || 'subdept') {
      setCartAddIcon(false);
      if (feature != highlight) {
        if (highlight) {
          highlight.set('hover', false);
          feature.dispatchEvent('change');
        }
        feature.set('hover', true);
        feature.dispatchEvent('change');
        highlight = feature;
      }

    } 
  } else {
    map.getTargetElement().style.cursor = 'auto';
    if (highlight) {
      highlight.set('hover', false);
      highlight = undefined;
    }
  }
}
