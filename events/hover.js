import {view, map} from '../index.js';
import {productsImageMax} from '../constants.js';
import {productCardOverlay, productDetailOverlay, renderProductOverlay, hideOverlay} from '../components/overlays.js';
import {handleJumpStrips} from '../components/jumpstrips.js';

export let jumpStripsInt = null;
let highlight = undefined; 
export const handleHover = function(e) {
  const resolution = view.getResolution();
  if (jumpStripsInt != null) {
    window.clearInterval(jumpStripsInt);
    window.jumpStripActive = false; 
  }

  const size = map.getSize();
  if (resolution < view.getMaxResolution() && (e.pixel[0] < 100 || e.pixel[1] < 100 || e.pixel[0] > size[0] - 100 || e.pixel[1] > size[1] - 100)) {
    jumpStripsInt = window.setInterval(handleJumpStrips, 16, e);
    hideOverlay(productCardOverlay);
    return
  } else if (jumpStripsInt != null) {
    window.clearInterval(jumpStripsInt);
    map.getTargetElement().style.cursor = '';
    window.jumpStripActive = false;
  }

  if (map.hasFeatureAtPixel(e.pixel)) {
    const features = map.getFeaturesAtPixel(e.pixel);
    const feature = features[0];
    const featureType = feature.get('type');

    if (featureType == 'product') {
      renderProductOverlay(feature, productCardOverlay);
    } 
    else if ((resolution > productsImageMax) && (featureType == 'brand' || 'dept' || 'subdept')) {
      hideOverlay(productCardOverlay);
      map.getTargetElement().style.cursor = 'pointer';
      if (feature != highlight) {
        if (highlight) {
          highlight.set('hover', false);
          feature.dispatchEvent('change');
        }
        feature.set('hover', true);
        feature.dispatchEvent('change');
        highlight = feature;
      }

    } else {
      hideOverlay(productCardOverlay);
      map.getTargetElement().style.cursor = '';
    }
  } else {
    hideOverlay(productCardOverlay);
    map.getTargetElement().style.cursor = '';
    if (highlight) {
      highlight.set('hover', false);
      highlight = undefined;
    }
  }
}
